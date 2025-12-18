# AI-Driven Discussion Board   
A sophisticated comment system built with **Django REST Framework** and **React**. This project implements full CRUD functionality with a deep focus on **Optimistic UI** patterns and server-side data integrity.   
## 🌟 Technical Highlights   
### 1. Full-Stack Architecture    
- **Server-Side Data Integrity**: Overrode the DRF `perform\_create` hook to enforce server-generated `author` (locked to "Admin") and `date`, ensuring core business data cannot be spoofed by client-side requests.   
- **RESTful Design**: Leveraged the `ModelViewSet` architecture to implement standard `GET`, `POST`, `PATCH`, and `DELETE` operations. By maintaining a stateless backend, the system ensures seamless horizontal scalability behind a load balancer.   
   
### 2. Advanced Frontend Interaction (Optimistic UI)   
- **Zero-Latency  Like-Toggle System**: Zero-Latency Like-Toggle System: Implemented a "Smart Toggle" strategy supporting both liking and unliking. The UI updates the count instantly (+1/-1) before the network request is initiated, with user state persisted in localStorage to ensure a seamless, high-performance experience.
- **Timeout & Rollback Mechanism**: Integrated `AbortController` to implement a strict 5-second request timeout. If a network disruption, server downtime, or timeout occurs, the system automatically triggers a state rollback to maintain data consistency.   
   
### 3. Modern Tech-Focused UI   
- **Minimalist Aesthetics**: Features a clean, tech-oriented design with a focus on typography and spacing, utilizing high-contrast backgrounds to ensure content readability.   
- **Theme Persistence**: A responsive dark/light mode engine using CSS Variables with state persistence in `localStorage`.   
- **Robust Image Presentation**: Includes defined image thumbnail styling with hover effects and basic aspect-ratio handling to ensure visual consistency in the comment feed.
- **Unified State Management**: Efficiently handles real-time UI updates and server synchronization through a centralized React useState flow, ensuring the UI stays in sync with the backend database.   
 --- 
   
## 🛠️ Setup & Installation   
### 1. Backend Configuration (Django + PostgreSQL)   
**Note**: For security reasons, the database password in `backend/settings.py` has been replaced with a placeholder. Please update it to match your local environment.   
1. **Prepare Database**:   
    - Ensure PostgreSQL is installed and running.   
    - Create the project database: `CREATE DATABASE bobyard\_db;`.   
2. **Create Virtual Environment** (Recommended):   
```
cd backend
python -m venv venv
Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
```

3. **Install Dependencies**:   
```
pip install -r requirements.txt
```

4. **Configure Settings**:   
    - Open `backend/settings.py` and locate the `DATABASES` configuration.   
    - Enter your local PostgreSQL `USER` and `PASSWORD`.   
5. **Initialize Data**:   
```
python manage.py makemigrations
python manage.py migrate
```

6. **Start Server**: `python manage.py runserver`   
   
### 2. Frontend Configuration (React + Vite)   
1. **Install Dependencies**:   
```
cd frontend
npm install
```

2. **Start Development Server**:   
```
npm run dev
```

 --- 
   
## 📂 Repository Standards   
- `**.gitignore**`: Properly configured to exclude `venv/`, `node\_modules/`, `.env`, and Python bytecode, keeping the repository clean.   
- **Requirements**: All backend dependencies are locked in `requirements.txt` for high environment reproducibility.   
- **Media Handling**: Comments support image displays. For the scope of this challenge, images are managed via URL strings to ensure seamless demoing across different local environments.   
 --- 
   
## 🚀 Future Scalability   
- **Asset Management**: Currently using URL-based images for rapid development. Future iterations could implement `FileField` with AWS S3 or Cloudinary integration for true multi-media uploads.   
- **Advanced Authentication (JWT/OAuth2)**: While currently using a hardcoded "Admin" profile for simplicity, the system is designed to integrate **Djoser** or **SimpleJWT**. This would allow for secure user registration, profile management, and role-based access control (RBAC).   
 --- 
   
**Author**: Jing Du   
**Project for**: Bobyard Fullstack Engineer Challenge   
