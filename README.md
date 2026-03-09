# 🚛 LogiMatch

Plateforme B2B de gestion logistique transport pour **éviter les trajets à vide**.  
Deux acteurs : **ADMIN** (gestion des comptes) et **COMPANY** (publication d'offres/demandes de transport).

---

## 🏗️ Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Java 17 (compatible 21), Spring Boot 3.4.3, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL |
| Frontend | Angular 19, Angular Material, Standalone Components, RxJS |
| Infra | Docker, docker-compose, nginx |

---

## ⚙️ Prérequis

### Lancement via Docker *(recommandé)*
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24 ou Docker Engine + Compose v2

### Lancement local
- **Java 17+** (ou 21) et **Maven 3.9+**
- **Node 22+** et **npm 10+**
- **PostgreSQL 16** accessible localement *(ou laisser H2 par défaut)*

---

## 🚀 Lancement rapide (Docker)

```bash
# Cloner le repo
git clone https://github.com/ainarrono-dev/Test.git logimatch
cd logimatch

# Démarrer tous les services (postgres + backend + frontend)
docker compose up --build

# Arrêter
docker compose down
```

| Service | URL |
|---------|-----|
| Frontend (Angular) | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Santé backend | http://localhost:8080/actuator/health |

---

## 💻 Lancement local (sans Docker)

### 1 — Backend

```bash
cd backend

# Lancer avec H2 en mémoire (profil par défaut)
mvn spring-boot:run

# Ou avec PostgreSQL local (créer la base d'abord)
# createdb logimatch
# SPRING_PROFILES_ACTIVE=docker \
#   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/logimatch \
#   mvn spring-boot:run
```

Le backend démarre sur **http://localhost:8080**.

### 2 — Frontend

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```

---

## 🔑 Comptes de démo

| Rôle | Email | Mot de passe | Accès |
|------|-------|-------------|-------|
| **ADMIN** | `admin@logimatch.com` | `admin123` | Tableau de bord admin, validation comptes |
| **COMPANY** (à créer) | *(votre email)* | *(votre choix)* | Offres / Demandes / Engagements |

> **Note** : Les comptes COMPANY créés via `/register` ont le statut `validated=false`.  
> Un ADMIN doit les valider via le tableau de bord admin avant qu'ils puissent publier.

---

## 📋 Plans d'abonnement

| Plan | Offres actives max | Demandes max | Score visibilité | Création |
|------|--------------------|-------------|-----------------|---------|
| **FREE** | 0 | 0 | 10 | ❌ Lecture seule (détails masqués) |
| **MEDIUM** | 5 | 5 | 50 | ✅ |
| **EXTRA** | 20 | 20 | 100 | ✅ |

> Le score de visibilité détermine l'ordre d'affichage :  
> `visibility = plan.baseScore × 0.6 + user.reliabilityScore × 0.4`

---

## 🛠️ API REST

Base URL : `http://localhost:8080/api`  
Authentification : `Authorization: Bearer <token>`

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Créer un compte COMPANY |
| POST | `/auth/login` | Connexion → retourne JWT |

### Offres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/offers` | Liste triée par visibilité |
| POST | `/offers` | Créer une offre (MEDIUM/EXTRA, validé) |
| GET | `/offers/{id}` | Détail |
| POST | `/offers/{id}/close` | Fermer |
| POST | `/offers/{id}/cancel` | Annuler |

### Demandes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/requests` | Liste triée |
| POST | `/requests` | Créer une demande |
| GET | `/requests/{id}` | Détail |

### Engagements
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/commitments` | Mes engagements |
| POST | `/commitments` | Engager une quantité |
| POST | `/commitments/{id}/cancel` | Annuler |
| POST | `/commitments/{id}/complete` | Compléter |

### Admin
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/users` | Liste des utilisateurs |
| POST | `/admin/users/{id}/validate` | Valider un compte |
| POST | `/admin/users/{id}/suspend` | Suspendre |
| POST | `/admin/users/{id}/reliability` | Modifier le score de fiabilité |
| GET | `/admin/actions` | Journal des actions admin |

---

## 🧪 Tests

```bash
cd backend
mvn test
```

- **5 tests** : 4 tests unitaires `ScoringService` + 1 test d'intégration Spring context

---

## 🗂️ Structure du projet

```
.
├── backend/                     # Spring Boot 3.4.3
│   ├── src/main/java/com/logimatch/
│   │   ├── config/              # SecurityConfig, JwtProperties
│   │   ├── controller/          # Auth, Offer, Request, Commitment, Admin
│   │   ├── domain/              # Entités JPA
│   │   ├── dto/                 # Records Java (request/response)
│   │   ├── repository/          # Spring Data JPA
│   │   ├── security/            # JWT filter, UserDetailsService
│   │   └── service/             # Logique métier
│   └── src/main/resources/
│       ├── application.yml      # Profil local (H2)
│       ├── application-docker.yml  # Profil Docker (PostgreSQL)
│       └── db/migration/
│           ├── V1__init.sql     # Schéma complet
│           └── V2__seed_plans.sql  # Plans FREE/MEDIUM/EXTRA + admin
├── frontend/                    # Angular 19 + Material
│   ├── src/app/
│   │   ├── guards/              # authGuard, adminGuard
│   │   ├── interceptors/        # JWT interceptor
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── pages/               # login, register, dashboard, offers, requests, commitments, admin
│   │   └── services/            # AuthService, OfferService, ...
│   ├── Dockerfile
│   └── nginx.conf
├── backend/Dockerfile
└── docker-compose.yml
```
