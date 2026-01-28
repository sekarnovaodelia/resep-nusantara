# Performance Optimization - Testing & Verification Guide

## 🧪 How to Verify the Optimizations Are Working

### 1. **Testing Bookmark Context Caching**

#### Setup:
1. Navigate to Home page
2. Open Browser DevTools → Network tab
3. Filter for "bookmarks" requests

#### Test Scenario:
```
1. Login to application
   ✅ Expected: Single "bookmarks" request (fetching all bookmarks)
   ❌ Should NOT see: Multiple bookmark requests

2. Toggle a recipe bookmark on Home
   ✅ Expected: Instant UI update (optimistic)
   ✅ Expected: One "bookmarks" POST/DELETE request
   
3. Navigate to Profile → Collection tab
   ✅ Expected: NO new bookmark fetch (uses cached context)
   
4. Navigate to RecipeDetail → Bookmark button
   ✅ Expected: NO bookmark count query
   ✅ Expected: Instant O(1) check from context Set
```

---

### 2. **Testing Social Context (Follow Status)**

#### Setup:
1. Login to application
2. Open Browser DevTools → Console (for logs)
3. Open DevTools → Application → Supabase logs (if available)

#### Test Scenario:
```
1. Login to application
   ✅ Expected: Console log "✅ Following status cached: X users"
   ✅ Expected: Single followers query on login
   
2. Navigate to PublicProfile of another user
   ✅ Expected: NO additional follow status query
   ✅ Expected: O(1) isFollowing() lookup from context
   ✅ Expected: One "followers" count query (for stats)
   
3. Click "Ikuti" (Follow) button
   ✅ Expected: Instant button state change (optimistic)
   ✅ Expected: One POST to "followers" table
   ✅ Expected: Global context updates (follow count changes)
   
4. Navigate to another PublicProfile
   ✅ Expected: Follow button reflects cached status
   ✅ Expected: NO re-query of followers
```

---

### 3. **Testing Profile Stats Consolidation**

#### Setup:
1. Open Browser DevTools → Network tab
2. Filter for "HEAD" requests or "count" queries
3. Navigate to Profile page

#### Test Scenario - BEFORE (Would show 3 requests):
```
❌ HEAD /followers?count=exact&following_id=uuid
❌ HEAD /followers?count=exact&follower_id=uuid  
❌ HEAD /recipes?count=exact&user_id=uuid
```

#### Test Scenario - AFTER (Shows 1 request):
```
✅ Parallel Promise.all() - shows as 1 request
✅ Console log: "✅ Profile stats cached for: uuid {followers, following, recipes}"
```

#### Verification Steps:
1. Open Browser DevTools
2. Go to Network tab
3. Click Profile link
4. In Network tab, look for Supabase API calls
5. Should see **1 consolidated request** (not 3 separate HEAD requests)
6. Response should contain followers, following, and recipes counts

---

### 4. **Testing Meal Planner Range Deduplication**

#### Setup:
1. Navigate to Planner page
2. Open Browser DevTools → Console (for logs)
3. Keep DevTools Network tab visible

#### Test Scenario:
```
1. Load Planner (initial load)
   ✅ Expected: One "meal_plans" query for date range
   ✅ Expected: Console log: "✅ Meal plans fetched for range: Mon Jan 27 2025_Wed Feb 26 2025"
   
2. Click "Previous Day" button (navigate backward)
   ✅ Expected: If range is still same → NO new request
   ✅ Expected: Console log: "🟢 Meal plan range already fetched, skipping..."
   
3. Click "Next Day" button (navigate forward several times)
   ✅ Expected: If range changes significantly → NEW request
   ✅ Expected: Console log: "✅ Meal plans fetched for range: [NEW RANGE]"
   
4. Click "Week Back" button
   ✅ Expected: NEW request (different range)
   ✅ Expected: Updates meal plan state
```

#### Expected Console Output:
```
✅ Meal plans fetched for range: Mon Jan 27 2025_Wed Feb 26 2025
🟢 Meal plan range already fetched, skipping...  (when navigating within same range)
✅ Meal plans fetched for range: Mon Feb 10 2025_Wed Mar 12 2025  (when range changes)
```

---

### 5. **Testing React StrictMode Safety**

#### Setup:
1. Application should be running in development mode
2. React StrictMode automatically runs effect cleanup + re-run in dev
3. Open Browser DevTools → Console

#### Test Scenario:
```
1. Login to application
   ✅ Expected: Single "auth session" call
   ✅ Expected: Single "profiles" call for user
   ✅ Expected: Single "bookmarks" call
   ✅ Expected: Single "followers" call
   ❌ Should NOT see duplicate calls during double-mount

2. Refresh page
   ✅ Expected: Same pattern as initial load (no duplicates)
   
3. Navigate between pages
   ✅ Expected: No console warnings about "Unmounted component"
   ✅ Expected: No duplicate API requests
```

#### Console Logs to Look For:
```javascript
// ✅ Good - Shows refs preventing duplicates:
"🟢 Following status cached: 42 users"
"✅ Bookmarks cached: 15 recipes"

// ❌ Bad - Would indicate duplicate fetches:
"🟢 Following status cached: 42 users"
"🟢 Following status cached: 42 users"  (duplicate!)
```

---

### 6. **Manual Performance Testing (Chrome DevTools)**

#### Network Panel Analysis:
1. Open Chrome DevTools
2. Go to Network tab
3. **Disable cache** (check "Disable cache" box)
4. Refresh page and login

**Measure:**
- Profile page load time: Should be **significantly faster** (single consolidated request)
- Planner load time: Should **remain same** (same data fetched)
- Bookmark operations: Should be **instant** (optimistic + no duplicate fetches)

#### Performance Panel (Flamechart):
1. Go to Performance tab
2. Record during: Profile page load
3. **Expected:** 
   - Fewer fetch tasks
   - Faster profile stats loading
   - More time spent on rendering than fetching

---

### 7. **Automated Test Cases (If Using Jest)**

```javascript
// Example test for BookmarkContext
describe('BookmarkContext', () => {
    test('should fetch bookmarks only once on mount', async () => {
        const fetchSpy = jest.spyOn(supabase, 'from');
        render(<BookmarkProvider><TestComponent /></BookmarkProvider>);
        await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    });

    test('should return O(1) bookmark check', () => {
        const { result } = renderHook(() => useBookmarks());
        const start = performance.now();
        result.current.isBookmarked('recipe-123');
        const end = performance.now();
        expect(end - start).toBeLessThan(1); // Should be instant
    });
});

// Example test for SocialContext
describe('SocialContext', () => {
    test('should consolidate profile stats into single fetch', async () => {
        const { result } = renderHook(() => useSocial());
        const stats = await result.current.fetchProfileStats('user-id');
        
        // Verify response structure
        expect(stats).toEqual({
            followers: expect.any(Number),
            following: expect.any(Number),
            recipes: expect.any(Number)
        });
    });
});
```

---

### 8. **Real-World Usage Scenarios**

#### Scenario 1: Social Discovery Flow
```
1. User logs in
   API Calls: 3 (auth + bookmarks + following)
   
2. Views 10 recipes on Home
   API Calls: 0 additional (all cached)
   
3. Clicks on user profile from recipe card
   API Calls: 1 (profile stats consolidated)
   
4. Views 5 public profiles
   API Calls: 5 (consolidated stats per profile)
   
Total API Calls: 9
Expected w/o optimization: 25+
```

#### Scenario 2: Meal Planner Usage
```
1. User opens Planner
   API Calls: 1 (meal plans for range)
   
2. Navigates day by day (forward/backward)
   API Calls: 0 additional (same range cached)
   
3. Jumps to next month
   API Calls: 1 (new range fetched)
   
4. Reviews past month
   API Calls: 0 additional (range cached)
   
Total API Calls: 2
Expected w/o optimization: 10+
```

---

## ✅ Checklist for Full Verification

- [ ] Bookmarks fetch once on login (check Network tab)
- [ ] Profile page uses consolidated stats (single request for 3 counts)
- [ ] PublicProfile pages use cached follow status (no per-page follow query)
- [ ] Meal Planner doesn't refetch same date ranges (check console logs)
- [ ] React StrictMode doesn't cause duplicate API requests
- [ ] Bookmark toggle is instant (optimistic update)
- [ ] Follow toggle is instant (optimistic update)
- [ ] All pages display correct cached data
- [ ] No "Unmounted component" warnings in console
- [ ] No console errors related to context usage

---

## 🐛 Troubleshooting

### Issue: Bookmarks not appearing correct
**Solution:** Clear local cache and re-login
```bash
# Clear all localStorage
localStorage.clear();
# Refresh page
```

### Issue: Follow status not syncing across pages
**Solution:** Verify SocialProvider wraps entire app in App.jsx

### Issue: Meal plans refetching unnecessarily
**Solution:** Check browser console for range key changes (expected behavior)

### Issue: Can't see console logs
**Solution:** Add to `.env.local`:
```
VITE_LOG_LEVEL=debug
```

---

**All optimizations are live and ready for testing! 🚀**
