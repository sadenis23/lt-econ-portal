# LT-Econ Portal Onboarding System

## Overview

This document describes the comprehensive personalized onboarding & profile system implemented for the LT-Econ Portal. The system provides a 4-step wizard that collects user preferences to drive content recommendations and email digests.

## Features Implemented

### ✅ Core Onboarding Flow
- **4-step wizard** with progress tracking
- **Account information** collection (first name)
- **Stakeholder role selection** (7 roles with icons)
- **Topic interests** multi-select (9 economic topics)
- **Communication preferences** (newsletter, frequency, language)
- **Auto-save** on step changes
- **Deep link support** (`/signup?intent=download-dataset`)

### ✅ User Experience
- **Progress bar** with 25% increments
- **Keyboard navigation** support
- **Live ARIA status** updates
- **Framer Motion animations** with reduced motion support
- **Completion modal** with personalized greeting
- **Skip functionality** for later completion

### ✅ Data Model
- **Profile table** with user preferences
- **Topic table** with multilingual support
- **ProfileTopic junction** table for M:N relationships
- **Dashboard tags** for recommendation matching

### ✅ Personalization
- **TF-IDF inspired** recommendation algorithm
- **Content filtering** based on user interests
- **Email digest** system foundation
- **Access control** for raw data exports

## Technical Implementation

### Backend (FastAPI + SQLModel)

#### Database Models
```python
# New models added to models.py
class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    first_name: Optional[str] = None
    role: Optional[StakeholderRole] = None
    language: Language = Field(default=Language.LT)
    newsletter: bool = Field(default=True)
    digest_frequency: DigestFrequency = Field(default=DigestFrequency.WEEKLY)
    onboarding_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name_lt: str
    name_en: str
    description_lt: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileTopic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    profile_id: int = Field(foreign_key="profile.id")
    topic_slug: str = Field(foreign_key="topic.slug")
```

#### API Endpoints
- `GET /profiles/me` - Get current user's profile
- `PATCH /profiles/me` - Update profile (auto-save)
- `GET /profiles/topics` - Get available topics
- `GET /profiles/roles` - Get stakeholder roles
- `GET /profiles/recommendations` - Get personalized recommendations

### Frontend (Next.js + React)

#### Components Structure
```
src/components/
├── atoms/
│   ├── RoleCard.tsx          # Stakeholder role selection card
│   ├── TopicChip.tsx         # Topic interest selection chip
│   └── ProgressBar.tsx       # Wizard progress indicator
├── molecules/
│   ├── OnboardingWizard.tsx  # Main wizard container
│   └── onboarding/
│       ├── AccountStep.tsx   # Step 1: Account info
│       ├── RoleStep.tsx      # Step 2: Role selection
│       ├── TopicsStep.tsx    # Step 3: Topic interests
│       ├── PreferencesStep.tsx # Step 4: Communication prefs
│       └── CompletionModal.tsx # Success modal
```

#### Key Features
- **React Hook Form** with Yup validation
- **Framer Motion** for smooth animations
- **Lucide React** icons for role cards
- **Responsive design** with Tailwind CSS
- **Accessibility** with ARIA labels and keyboard navigation

## Stakeholder Roles

1. **Policy Maker** - Government officials, policy analysts
2. **Journalist** - Media professionals, reporters
3. **Academic** - Researchers, professors
4. **Business** - Business owners, managers
5. **NGO Representative** - Non-governmental organizations
6. **Student** - University/college students
7. **Citizen** - General public interested in economic data

## Topics of Interest

1. **Economy** - General economic indicators
2. **Labor** - Employment and labor market data
3. **Prices** - Inflation and price indices
4. **Public Finance** - Government budgets and spending
5. **Social Indicators** - Demographics and social statistics
6. **Energy** - Energy production and consumption
7. **Environment** - Environmental data and sustainability
8. **Regional** - Regional economic comparisons
9. **Data** - Raw datasets and downloads

## User Flow

### Entry Points
1. **Sign up buttons** in header and hero section
2. **Deep links** with intent parameters
3. **Profile page** for incomplete onboarding

### Onboarding Steps
1. **Account** (30 seconds)
   - First name input
   - Account information display
   
2. **Role** (20 seconds)
   - Visual role cards with icons
   - Language toggle (LT/EN)
   - Privacy notice
   
3. **Topics** (25 seconds)
   - Multi-select topic chips
   - Selection summary
   - Pro tips
   
4. **Preferences** (15 seconds)
   - Newsletter toggle
   - Digest frequency (daily/weekly/monthly)
   - Language preference
   - Summary preview

### Completion
- **Success modal** with personalized greeting
- **CTA buttons**: "View Recommendations" or "Finish Later"
- **Profile completion** status updated

## Personalization Logic

### Recommendation Algorithm
```python
# Simple TF-IDF inspired scoring
matching_topics = len(set(dashboard_tags) & user_topic_slugs)
total_user_topics = len(user_topic_slugs)
score = matching_topics / total_user_topics if total_user_topics > 0 else 0.0
```

### Content Filtering
- **Home page**: Replace "Trending questions" with "Because you follow [topics]"
- **Dashboard recommendations**: Based on topic intersection
- **Email digests**: Filtered by user interests
- **API access**: Raw data exports gated behind signup

## Accessibility Features

### WCAG AA Compliance
- **Contrast ratios** meet AA standards
- **Keyboard navigation** for all interactive elements
- **Screen reader** support with ARIA labels
- **Focus management** between steps
- **Reduced motion** support

### ARIA Implementation
- **Live regions** for step updates
- **Progress indicators** with current/total
- **Form validation** announcements
- **Modal focus** trapping

## Privacy & Trust

### Data Usage
- **Profile data** used only for content personalization
- **Never shared** with third parties
- **Privacy policy** links throughout onboarding
- **Clear consent** for newsletter subscriptions

### Security
- **JWT authentication** for API access
- **Password hashing** with bcrypt
- **HTTPS** for all communications
- **Input validation** on both client and server

## Testing & Quality

### Form Validation
- **Client-side**: Yup schemas with real-time feedback
- **Server-side**: Pydantic models with error handling
- **Edge cases**: Empty selections, invalid inputs

### Error Handling
- **Network failures**: Graceful degradation
- **API errors**: User-friendly messages
- **Validation errors**: Inline field feedback
- **Loading states**: Clear progress indicators

## Future Enhancements

### Planned Features
1. **SSO Integration** (Google, GitHub)
2. **Email digest** background jobs
3. **Advanced recommendations** with ML
4. **Profile analytics** dashboard
5. **Bulk data export** functionality

### Technical Improvements
1. **Caching** for topics and roles
2. **Rate limiting** for API endpoints
3. **Analytics tracking** for onboarding completion
4. **A/B testing** framework for optimization

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- SQLite (or PostgreSQL for production)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd next-frontend
npm install
npm run dev
```

### Database Initialization
The database will be automatically initialized with sample data on first run, including:
- 9 economic topics (bilingual)
- 6 sample dashboards with tags
- Sample reports and datasets

## API Documentation

### Authentication
All profile endpoints require JWT authentication:
```http
Authorization: Bearer <token>
```

### Example Requests
```bash
# Get user profile
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/profiles/me

# Update profile
curl -X PATCH -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","role":"academic"}' \
  http://localhost:8000/profiles/me

# Get recommendations
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/profiles/recommendations
```

## Troubleshooting

### Common Issues
1. **Database not initialized**: Restart backend server
2. **CORS errors**: Check frontend API URL configuration
3. **Authentication failures**: Verify JWT token storage
4. **Form validation errors**: Check Yup schema definitions

### Debug Mode
Enable debug logging in backend:
```python
# In main.py
app = FastAPI(debug=True)
```

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request

### Code Standards
- **TypeScript** for frontend components
- **Python type hints** for backend functions
- **ESLint** and **Prettier** for code formatting
- **Black** for Python code formatting

---

This onboarding system provides a solid foundation for user engagement and content personalization in the LT-Econ Portal. The modular architecture allows for easy extension and customization as requirements evolve. 