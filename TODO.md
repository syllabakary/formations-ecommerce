# Frontend & Backend Improvements TODO

## Frontend Enhancements
- [x] Create enhanced fetch wrapper with timeout and AbortController in `src/utils/api.ts`
- [ ] Modify `src/pages/Catalog.tsx` to load courses and favorites in parallel using Promise.all
- [ ] Update all optional field access to use consistent `?.` and `||` pattern throughout Catalog.tsx
a- [ ] Add proper skeleton loader components for loading states
- [ ] Enhance error handling with better user feedback and recovery options
- [ ] Update `src/hooks/useApi.tsx` to include timeout functionality

## Backend Optimizations
- [ ] Add caching to expensive queries in `backend/app/Http/Controllers/api/TrainingController.php`
- [ ] Ensure all relationships are eagerly loaded to prevent N+1 queries
- [ ] Add database indexes if needed for performance
- [ ] Implement query profiling for slow endpoints in FavoriteController
- [ ] Optimize polymorphic queries in FavoriteController

## Testing & Validation
- [ ] Test parallel loading performance improvement
- [ ] Verify timeout functionality prevents UI freeze
- [ ] Check error handling edge cases
- [ ] Profile backend query performance improvements
- [ ] Validate consistent optional chaining usage
