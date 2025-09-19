# Advanced Data Table - React & Angular Implementations

This repository contains two complete implementations of an advanced data table component - one in React and one in Angular 19.

## 🚀 Live Demos

- **React Demo**: Available locally at `http://localhost:5000` (when running `npm run dev`)
- **Angular Demo**: [https://echarnus.github.io/advanced-angular-tab/](https://echarnus.github.io/advanced-angular-tab/)

## 📱 Screenshots

### React Implementation
![React Implementation](https://github.com/user-attachments/assets/2d913d76-9650-449d-b51e-2142f97b482b)

### Angular Implementation  
![Angular Implementation](https://github.com/user-attachments/assets/6b248687-34cc-4eed-b17e-8c45e9f73b0c)

## ✨ Features

Both implementations provide identical functionality:

- **🔄 Sticky Headers**: Table headers remain visible while scrolling
- **📊 Sorting**: Click column headers to sort data (ascending/descending/none)  
- **📄 Pagination**: Navigate through data with configurable page sizes (10/20/50)
- **➕ Expandable Rows**: Click the + button to see detailed user information
- **📌 Frozen Columns**: ID and Name columns stay fixed during horizontal scrolling
- **🎨 Theme Switching**: Toggle between light and dark modes
- **⚙️ Configuration Panel**: JSON editor for dynamic column configuration  
- **⏳ Loading States**: Smooth loading experience with skeleton states
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
/
├── src/                    # React implementation
│   ├── components/
│   │   ├── AdvancedTable.tsx
│   │   ├── TableDemo.tsx
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── table-types.ts
│   │   └── utils.ts
│   └── hooks/
│       └── useTheme.ts
├── angular/               # Angular implementation  
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── advanced-table.component.ts
│   │   │   ├── table-demo.component.ts
│   │   │   └── ui/        # Reusable UI components
│   │   ├── services/
│   │   │   ├── theme.service.ts
│   │   │   └── data.service.ts
│   │   └── types/
│   │       └── table.types.ts
└── .github/workflows/     # GitHub Pages deployment
    └── deploy.yml
```

## 🛠️ Technologies Used

### React Version
- **React 19**: Latest React with modern hooks
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Strongly typed JavaScript
- **Phosphor Icons**: Beautiful icon set

### Angular Version  
- **Angular 19**: Latest Angular with standalone components
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Strongly typed JavaScript
- **Phosphor Icons**: Beautiful icon set

## 🚀 Getting Started

### React Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Angular Development
```bash
# Navigate to Angular project
cd angular

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Build for GitHub Pages
npm run build -- --configuration=github-pages
```

## 📊 Sample Data

Both implementations use the same dataset:
- 50 sample users with realistic information
- Multiple roles: Admin, User, Manager, Developer, Designer, Analyst
- Three status types: active, inactive, pending
- Various departments: Engineering, Marketing, Sales, HR, Finance, Operations
- Salary ranges from $50,000 to $99,000
- Detailed descriptions of varying lengths to test text ellipsis

## 🎯 Feature Comparison

| Feature | React | Angular | Status |
|---------|--------|---------|---------|
| Sticky Headers | ✅ | ✅ | Identical |
| Column Sorting | ✅ | ✅ | Identical |
| Pagination | ✅ | ✅ | Identical |
| Expandable Rows | ✅ | ✅ | Identical |
| Frozen Columns | ✅ | ✅ | Identical |
| Theme Switching | ✅ | ✅ | Identical |
| Configuration Panel | ✅ | ✅ | Identical |
| Loading States | ✅ | ✅ | Identical |
| Responsive Design | ✅ | ✅ | Identical |
| Event Handling | ✅ | ✅ | Identical |

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.