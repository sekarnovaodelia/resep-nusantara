# ⚡ Quick Reference - Guard Patterns

## Pattern 1: Local Cache Filter (Use When You Have Cached Data)

**Best for:** Bookmarks, favorites, liked items

```javascript
// ✅ DO THIS:
import { useBookmarks } from '../context/BookmarkContext';

const MyComponent = () => {
    const { bookmarkedRecipeIds } = useBookmarks();
    const [recipes, setRecipes] = useState([]);
    
    // Filter locally instead of re-fetching
    const bookmarked = recipes.filter(r => bookmarkedRecipeIds.has(r.id));
    
    return <div>{/* render bookmarked */}</div>;
};

// ❌ DON'T DO THIS:
const bookmarked = await fetchBookmarkedRecipes(userId);  // Re-fetches!
```

---

## Pattern 2: Double-Check Guard (Use When Fetching Stats Multiple Times)

**Best for:** Profile stats, user counts, aggregate queries

```javascript
// ✅ DO THIS:
const lastFetchedIdRef = React.useRef(null);
const isFetchingRef = React.useRef(false);

useEffect(() => {
    const loadData = async () => {
        // Guard 1: Already fetching?
        if (isFetchingRef.current) return;
        
        // Guard 2: Already fetched for this ID?
        if (lastFetchedIdRef.current === userId) return;
        
        // Set BEFORE async
        isFetchingRef.current = true;
        lastFetchedIdRef.current = userId;
        
        try {
            const data = await fetchProfileStats(userId);
            setData(data);
        } finally {
            isFetchingRef.current = false;
        }
    };
    loadData();
}, [userId]);

// ❌ DON'T DO THIS:
useEffect(() => {
    const data = await fetchProfileStats(userId);
    setData(data);
}, [userId, fetchProfileStats]);  // No guards!
```

---

## Pattern 3: Early Ref Assignment (Use When Deduplicating Ranges)

**Best for:** Date ranges, pagination, dynamic range queries

```javascript
// ✅ DO THIS:
const lastRangeRef = React.useRef(null);

useEffect(() => {
    const loadData = async () => {
        const key = getRangeKey(start, end);
        
        // Check guard FIRST
        if (lastRangeRef.current === key) return;
        
        // SET REF BEFORE fetch (critical!)
        lastRangeRef.current = key;
        
        // NOW fetch
        const data = await fetchDataForRange(start, end);
        setData(data);
    };
    loadData();
}, [start, end]);

// ❌ DON'T DO THIS (will double-fetch in StrictMode):
useEffect(() => {
    const key = getRangeKey(start, end);
    if (lastRangeRef.current === key) return;
    
    const data = await fetchDataForRange(start, end);
    setData(data);
    lastRangeRef.current = key;  // TOO LATE! Set after fetch
}, [start, end]);
```

---

## When to Use Each Pattern

| Pattern | When to Use | Example |
|---------|-----------|---------|
| **Local Filter** | Data already in cache/state | Filter cached bookmarks/likes |
| **Double Guard** | Fetching expensive stats | Followers, following, counts |
| **Early Ref** | Deduplicating by key/range | Date ranges, pages, filters |

---

## Common Mistakes

### ❌ Mistake 1: Setting Ref After Async
```javascript
// WRONG - Ref set too late
const data = await fetch();
setState(data);
lastRef.current = key;  // Second mount can still pass guard!
```

### ❌ Mistake 2: No Early Return
```javascript
// WRONG - Still does work even if guarded
if (shouldSkip.current) {
    // ... still do other work here
}
```

### ❌ Mistake 3: Missing isCurrently Variable
```javascript
// WRONG - Can't tell if already fetching vs already fetched
const lastRef = React.useRef(null);
if (lastRef.current === key) return;  // Only checks if fetched, not if fetching
```

### ✅ Correct Approach
```javascript
// RIGHT - Both guards
const isFetchingRef = React.useRef(false);
const lastRef = React.useRef(null);

if (isFetchingRef.current) return;  // Guard against concurrent fetches
if (lastRef.current === key) return;  // Guard against duplicate calls

isFetchingRef.current = true;
lastRef.current = key;

try {
    await fetch();
} finally {
    isFetchingRef.current = false;
}
```

---

## Testing Your Guards

### Test 1: React StrictMode Double-Mount
```javascript
// Check console - should see fetch logs only ONCE
console.log('🔵 Fetching data...');
```

### Test 2: Rapid Navigation
```javascript
// Click buttons quickly - should not create race conditions
// Check Network tab - only one in-flight request
```

### Test 3: Tab Change Without Re-fetch
```javascript
// Change tab to different view
// Check Network tab - should be NO new API call
```

---

## Performance Checklist

- [ ] Using context for global state (not re-fetching everywhere)
- [ ] Using local Set<> for O(1) lookups instead of array.includes()
- [ ] Using cached IDs to filter instead of re-fetching join tables
- [ ] Guards set BEFORE async calls (not after)
- [ ] Double-checks: both `isFetching` AND `lastId` refs
- [ ] Dependency array is minimal (no callback functions that change)
- [ ] No duplicate queries in Network tab during StrictMode
- [ ] Optimistic updates working (instant UI feedback)

---

**All patterns production-tested and safe!** ✅
