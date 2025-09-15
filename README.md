[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
✍️  
Setup the .env file:
```env
VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
VITE_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
```
Run the project use this command:
```bash
npm run dev
```

## 🔗 Deployed Web URL or APK file
✍️ [Paste your link here]


## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Paste your video link here]


## 💻 Project Introduction

### a. Overview

✍️ Based on my experiences during my university days, I realized that effective task management requires significant effort and coordination. Working with development tools like GitHub, project management platforms like Jira and Notion has shaped my understanding of how productivity tools can streamline workflows. Drawing from these experiences, this project combines the best aspects of various task management tools to create an integrated solution that optimizes personal and academic productivity. The application addresses the common challenge Vietnamese university students face in managing their time across classes, assignments, projects, and personal commitments by providing a unified platform with multiple visualization methods.

### b. Key Features & Function Manual

✍️
**Core Features:**

1. **Kanban Board Management**
   - Create, edit, and delete task columns (To Do, In Progress, Done, etc.)
   - Drag-and-drop task management between columns
   - Real-time task updates and persistent storage

2. **Calendar View**
   - Full calendar interface with month, week, and day views
   - Create events with specific date/time slots
   - All-day event support
   - Vietnam timezone support for accurate scheduling

3. **Analytics Dashboard**
   - Task completion rate tracking
   - Distribution analysis across different columns
   - Current productivity metrics without historical trends

4. **Advanced Search & Filtering**
   - Real-time task search across titles and descriptions
   - Filter by task properties
   - Search result statistics and highlighting

5. **Data Persistence**
   - Firebase Firestore integration for reliable data storage
   - Real-time synchronization across sessions
   - Scalable architecture supporting 20+ concurrent tasks

### c. Unique Features (What’s special about this app?) 

✍️
**Core Features:**

**Three Unified Views of Same Data:**
- Unlike traditional apps that separate calendar and task management, this application provides three distinct but interconnected views of task data: Kanban board for workflow visualization, Calendar for timeline management, and Analytics for productivity insights.

**Student-Centric Design:**
- Specifically designed for Vietnamese university students with Vietnam timezone support, academic workflow patterns, and task management suitable for balancing studies, assignments, and personal tasks.

**Real-time Visual Feedback:**
- Immediate visual updates with drag-and-drop functionality and dynamic charts that respond to task changes without page reloads.

**Seamless View Switching:**
- Instant navigation between different task views while maintaining data consistency and state management across the entire application.

### d. Technology Stack and Implementation Methods

✍️

**Frontend Framework:**
- React 18 with TypeScript for type-safe development
- Vite for fast development and optimized builds
- Tailwind CSS for responsive and modern UI design

**State Management:**
- React Context API for global state management
- Custom hooks for search functionality and data fetching
- useReducer for complex state logic in Kanban operations

**UI/UX Libraries:**
- @dnd-kit for drag-and-drop functionality in Kanban board
- FullCalendar for comprehensive calendar interface
- Custom chart components for analytics visualization

**Backend & Database:**
- Firebase Firestore for NoSQL document-based storage
- Real-time database listeners for live updates
- Collection-based data structure for tasks and calendar events

**Development Tools:**
- TypeScript for enhanced code reliability and developer experience
- ESLint and Prettier for code consistency
- Custom utility functions for analytics calculations

### e. Service Architecture & Database structure (when used)

✍️

```
Firestore Database:
├── columns/
│   ├── {columnId}
│   │   ├── id: string
│   │   ├── title: string
│   │   ├── order: number
│   │   └── createdAt: timestamp
│   
├── tasks/
│   ├── {taskId}
│   │   ├── id: string
│   │   ├── content: string
│   │   ├── columnId: string
│   │   ├── order: number
│   │   ├── assignee?: string
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   
└── calendar_events/
    ├── {eventId}
    │   ├── id: string
    │   ├── title: string
    │   ├── description?: string
    │   ├── start: Date
    │   ├── end: Date
    │   ├── allDay: boolean
    │   ├── status: 'scheduled' | 'completed' | 'cancelled'
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
```

**Service Layer:**
- `kanbanService.tsx`: CRUD operations for columns and tasks
- `calendarService.tsx`: Event management with timezone handling
- `Analytics.tsx`: Data processing and statistics calculation
- `firebase.tsx`: Database configuration and connection management
## 🧠 Reflection

### a. If you had more time, what would you expand?

✍️

**Advanced Collaboration Features:**
- Multi-user support for team project management
- Real-time collaboration with live cursors and comments
- Assignment delegation and progress tracking across team members

**Task Enhancement Features:**
- Priority levels (High, Medium, Low) with color coding
- Due date tracking and deadline notifications
- Task categorization and tagging system


### b. If you integrate AI APIs more for your app, what would you do?

✍️

**Intelligent Task Management:**
- Natural Language Processing (NLP) for automatic task parsing from text input
- Smart task categorization and automatic organization
- Automated task breakdown for complex assignments into manageable subtasks

**Personalized Productivity Assistant:**
- AI-powered productivity coaching based on individual work patterns
- Personalized study schedule optimization using machine learning algorithms
- Stress level detection and workload balancing recommendations


## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled 
