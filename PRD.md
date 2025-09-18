# Advanced Data Table Component

A comprehensive React table component with advanced UX behaviors including sticky headers, pagination, sorting, expandable rows, and frozen columns.

**Experience Qualities**: 
1. **Professional** - Clean, enterprise-grade interface that inspires confidence
2. **Responsive** - Seamless interaction across all device sizes with touch-friendly controls  
3. **Efficient** - Fast data navigation with sticky headers and smart pagination

**Complexity Level**: Light Application (multiple features with basic state)
- Handles complex table interactions while maintaining simplicity through event-driven architecture

## Essential Features

**Data Display**
- Functionality: Render tabular data from memory or HTTP sources
- Purpose: Present structured information in an accessible format
- Trigger: Component mount or data prop change
- Progression: Load data → Parse columns → Render table → Apply styling
- Success criteria: Data displays correctly with proper formatting

**Pagination System**
- Functionality: Navigate through large datasets with configurable page sizes
- Purpose: Improve performance and user experience with large data sets
- Trigger: Page navigation or page size change
- Progression: User selects page/size → Event emitted → Parent updates data → Table re-renders
- Success criteria: Smooth navigation with accurate page indicators

**Row Expansion**
- Functionality: Toggle detailed view for individual rows
- Purpose: Show additional information without navigating away
- Trigger: Click expand button or row
- Progression: Click row → Toggle expansion → Render custom template → Animate transition
- Success criteria: Smooth expand/collapse with custom content rendering

**Column Sorting**
- Functionality: Sort data by column with visual indicators
- Purpose: Allow users to organize data by their preferences
- Trigger: Click column header
- Progression: Click header → Show sort indicator → Emit sort event → Parent handles data update
- Success criteria: Clear visual feedback and proper event propagation

**Frozen Columns**
- Functionality: Keep important columns visible during horizontal scroll
- Purpose: Maintain context while viewing wide tables
- Trigger: Horizontal scroll
- Progression: Scroll starts → Frozen columns stay fixed → Content scrolls independently
- Success criteria: Smooth scrolling with fixed columns remaining aligned

**Responsive Design**
- Functionality: Adapt to different screen sizes and orientations
- Purpose: Ensure usability across all devices
- Trigger: Viewport size change
- Progression: Resize detected → Layout adjusts → Maintain functionality
- Success criteria: Full functionality preserved on mobile and desktop

## Edge Case Handling

- **Empty Data State**: Show informative empty state with call-to-action
- **Loading States**: Display skeleton loaders during data fetching
- **Network Errors**: Graceful error handling with retry options
- **Large Datasets**: Virtual scrolling for performance optimization
- **Touch Interactions**: Swipe gestures for mobile navigation
- **Keyboard Navigation**: Full accessibility with tab and arrow key support

## Design Direction

The design should feel professional and efficient, similar to enterprise applications like Mailchimp's interface - clean, functional, and confidence-inspiring with subtle modern touches that enhance usability without distraction.

## Color Selection

Analogous color scheme using professional blues and grays to create a cohesive, trustworthy interface that works well for data-heavy applications.

- **Primary Color**: Professional Blue (oklch(0.55 0.15 240)) - Commands attention for interactive elements
- **Secondary Colors**: Muted Blue-Gray (oklch(0.7 0.05 240)) - Supporting backgrounds and borders  
- **Accent Color**: Success Green (oklch(0.6 0.15 140)) - Status indicators and confirmation actions
- **Foreground/Background Pairings**: 
  - Background (Light Gray oklch(0.98 0.01 240)): Dark Gray text (oklch(0.2 0.02 240)) - Ratio 12.8:1 ✓
  - Card (White oklch(1 0 0)): Dark Gray text (oklch(0.2 0.02 240)) - Ratio 15.2:1 ✓  
  - Primary (Professional Blue oklch(0.55 0.15 240)): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Accent (Success Green oklch(0.6 0.15 140)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Use Inter for its exceptional readability in data-dense interfaces and professional appearance that scales well across different sizes and weights.

- **Typographic Hierarchy**: 
  - H1 (Table Title): Inter Semibold/24px/tight letter spacing
  - H2 (Section Headers): Inter Medium/18px/normal spacing  
  - Body (Table Data): Inter Regular/14px/relaxed line height
  - Caption (Pagination Info): Inter Regular/12px/muted color

## Animations

Subtle, purposeful animations that enhance functionality without slowing down data-focused workflows - smooth transitions for state changes and gentle feedback for interactions.

- **Purposeful Meaning**: Quick feedback animations reinforce user actions and guide attention to important changes
- **Hierarchy of Movement**: Row expansions and sort indicators receive primary animation focus, with subtle hover states for secondary elements

## Component Selection

- **Components**: Table (custom), Card (container), Button (actions), Select (page size), Badge (status), Skeleton (loading), ScrollArea (horizontal scroll)
- **Customizations**: Custom table component with sticky header behavior, frozen column implementation, and expandable row system
- **States**: Hover states for rows, active states for sort headers, loading states for data fetching, expanded states for detailed views
- **Icon Selection**: ChevronDown/ChevronUp for sorting, CaretLeft/CaretRight for pagination, Plus/Minus for row expansion
- **Spacing**: Consistent 16px padding for cells, 8px gaps between interactive elements, 24px margins for major sections
- **Mobile**: Stack columns vertically on small screens, convert to card-based layout below 768px, maintain core functionality with touch-friendly targets