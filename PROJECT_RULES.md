# Project Rules

## Git Commit Rules

### 1. Only Commit When Asked
- **NEVER commit changes automatically**
- **ONLY commit when explicitly requested** by the user
- Wait for explicit instruction before committing any changes

### 2. Commit Message Format
When asked to commit, **ALWAYS include the branch name** at the beginning of the commit message:

```
<branch-name>: <commit message>
```

**Examples:**
- `main: Add SKU dropdown functionality to product form`
- `feature/camera-improvements: Fix camera stream management issues`
- `bugfix/storage-bucket: Resolve storage bucket creation error`

### 3. Branch Name Detection
- Use the current git branch name from `git branch --show-current`
- If on `main` branch, use `main:`
- If on feature branch, use the actual branch name (e.g., `feature/sku-dropdown:`)

### 4. Commit Process
When user asks to commit:
1. Check current branch: `git branch --show-current`
2. Stage changes: `git add .`
3. Commit with branch prefix: `git commit -m "<branch-name>: <message>"`
4. Push changes: `git push`

### 5. Examples of Valid Commit Messages
```
main: Update ProductLogForm to use SKU dropdown from database
main: Add camera component for taking product photos
main: Fix TypeScript interface export errors
feature/sku-management: Create SKUs table and type definitions
bugfix/photo-upload: Resolve storage bucket not found error
```

### 6. What NOT to Do
- ❌ Don't commit without being asked
- ❌ Don't use generic messages like "Update files"
- ❌ Don't forget the branch name prefix
- ❌ Don't commit incomplete or broken code

### 7. Emergency Exceptions
Only commit automatically if:
- User explicitly says "commit now" or "save changes"
- There's a critical security issue that needs immediate fixing
- User is in immediate danger of losing work

## Development Rules

### 1. Code Quality
- Always run TypeScript checks before committing
- Ensure no linting errors
- Test functionality before committing

### 2. Documentation
- Update README.md for significant changes
- Add comments for complex logic
- Document new features

### 3. Testing
- Test new features thoroughly
- Verify database changes work correctly
- Check UI/UX improvements

## File Organization Rules

### 1. Component Structure
- Keep components in `/src/components/`
- Use TypeScript interfaces in `/src/types.d.ts`
- Database utilities in `/src/lib/`

### 2. Naming Conventions
- Components: PascalCase (e.g., `ProductLogForm.tsx`)
- Files: kebab-case (e.g., `database-setup.sql`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### 3. Import Organization
- React imports first
- Third-party libraries second
- Local imports last
- Use absolute imports when possible

## Database Rules

### 1. Schema Changes
- Always create SQL files for database changes
- Test database changes before committing
- Document schema changes in comments

### 2. Data Integrity
- Use proper foreign key relationships
- Enable Row Level Security (RLS)
- Create appropriate indexes

## UI/UX Rules

### 1. Accessibility
- Include `data-testid` attributes
- Include `data-referenceid` attributes
- Use semantic HTML elements
- Ensure keyboard navigation works

### 2. Responsive Design
- Use Tailwind CSS classes
- Test on mobile and desktop
- Ensure touch targets are adequate

### 3. User Feedback
- Show loading states
- Display error messages clearly
- Provide success confirmations
- Use consistent iconography

## Security Rules

### 1. Environment Variables
- Never commit `.env` files
- Use environment variables for sensitive data
- Document required environment variables

### 2. API Keys
- Keep API keys in environment variables
- Use proper Supabase RLS policies
- Don't expose sensitive data in client code

## Performance Rules

### 1. Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize database queries
- Use appropriate image formats

### 2. Monitoring
- Log errors appropriately
- Monitor database performance
- Track user interactions

---

**Remember: These rules are designed to maintain code quality, ensure proper version control, and create a consistent development workflow.**
