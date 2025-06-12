# Changelog

## 0.24.2

### 🐛 Bug Fixes

- make id field mandatory in GDPRConsentSchema &nbsp;-&nbsp; [<samp>(04d2fbc)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/04d2fbc)

### ♻️ Refactoring

- implement updating of fotter config via useFooter() instead of props &nbsp;-&nbsp; [<samp>(c4cf79b)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c4cf79b)

## Latest

### ✨ Features

- implement main layout with hero, stats, features, and recent activity sections &nbsp;-&nbsp; [<samp>(7853bb7)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7853bb7)
- set dynamic form to use sections &nbsp;-&nbsp; [<samp>(d12f5de)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d12f5de)
- update NuxtLayout binding to use props and integrate footer configuration &nbsp;-&nbsp; [<samp>(d670d01)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d670d01)
- add schemas docs for trials, patients, regulations, administration, study design, and auditing &nbsp;-&nbsp; [<samp>(29d6d0e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/29d6d0e)
- add landing page and getting started-section &nbsp;-&nbsp; [<samp>(839fe4f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/839fe4f)
- initialize Euro Clinical Trials documentation with configuration, README, and assets &nbsp;-&nbsp; [<samp>(f06a515)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f06a515)
- add Trials Dashboard and Trial Preview components with metrics and visualizations &nbsp;-&nbsp; [<samp>(01bad01)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/01bad01)
- implement site management features including creation, editing, and display of site details &nbsp;-&nbsp; [<samp>(9a22c3e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/9a22c3e)
- implement CRUD endpoints for managing clinical trial sites &nbsp;-&nbsp; [<samp>(097473c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/097473c)
- add edit patient page with dynamic form and error handling &nbsp;-&nbsp; [<samp>(2674194)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2674194)
- add development storage configuration for trials and patients &nbsp;-&nbsp; [<samp>(a2c3a55)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/a2c3a55)
- add sites store and repository for site data management &nbsp;-&nbsp; [<samp>(ba036ce)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ba036ce)
- add patient and trial stores providing to provide data context to resource finder &nbsp;-&nbsp; [<samp>(2fd365f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2fd365f)
- add patient registration and listing pages with dynamic data handling &nbsp;-&nbsp; [<samp>(6a795c6)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/6a795c6)
- add PatientComponent, PatientDataTable, and PatientDataTableDropDown components with patient details and actions &nbsp;-&nbsp; [<samp>(c514b1c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c514b1c)
- add endpoint to fetch all patients &nbsp;-&nbsp; [<samp>(1eaf47a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1eaf47a)
- implement ResourceRepository with support for cached and resilient types &nbsp;-&nbsp; [<samp>(ad5bf47)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ad5bf47)
- implement create method with cache invalidation in CachedRepository &nbsp;-&nbsp; [<samp>(e5e1ebd)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/e5e1ebd)
- define Entity interface for improved type safety in BaseRepository &nbsp;-&nbsp; [<samp>(88d1e72)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/88d1e72)
- refactor useTrialsStore to utilize createEntityStore for trial management &nbsp;-&nbsp; [<samp>(55093d4)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/55093d4)
- implement createEntityStore for managing entities with CRUD operations &nbsp;-&nbsp; [<samp>(f904f77)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f904f77)
- add PatientsRepository and TrialsRepository for patient and trial data management &nbsp;-&nbsp; [<samp>(abc4cdb)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/abc4cdb)
- implement BaseRepository and Cached repository as data getting layer. Deals with interacting with the backend and provides consistent data access &nbsp;-&nbsp; [<samp>(ee43364)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ee43364)
- implement CRUD endpoints for trials management &nbsp;-&nbsp; [<samp>(51b1b4a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/51b1b4a)
- add RepositoryFactory for dynamic repository creation and caching &nbsp;-&nbsp; [<samp>(cf686a3)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/cf686a3)
- implement BaseRepository, CachedRepository, and ResilientRepository for enhanced data handling and caching &nbsp;-&nbsp; [<samp>(7ec00b2)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7ec00b2)
- add PatientStatistics and EnrollmentTrend schemas for trial patient data analysis &nbsp;-&nbsp; [<samp>(f97badb)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f97badb)
- add TrialDataTableDropDown component and integrate into trial columns for displaying data table of Trials &nbsp;-&nbsp; [<samp>(9ff1089)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/9ff1089)
- add TrialComponent for displaying trial details and CRUD actions &nbsp;-&nbsp; [<samp>(4893602)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/4893602)

### 🐛 Bug Fixes

- remove 'patient' field from dynamic form schema &nbsp;-&nbsp; [<samp>(28c1d68)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/28c1d68)
- remove top level div with unwanted styling &nbsp;-&nbsp; [<samp>(148e87a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/148e87a)
- remove target=_blank for key feature section &nbsp;-&nbsp; [<samp>(94bf72b)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/94bf72b)
- remove duplicate entry &nbsp;-&nbsp; [<samp>(2c216a0)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2c216a0)
- rename back with / &nbsp;-&nbsp; [<samp>(8b83b43)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/8b83b43)
- add .npmrc and .nuxtrc configuration files &nbsp;-&nbsp; [<samp>(7d4f58f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7d4f58f)
- update SEO title and description to use site name instead of incorrect field subjectId &nbsp;-&nbsp; [<samp>(e099714)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/e099714)
- update form submission with site resource, component attribute formatting and correct navigation link &nbsp;-&nbsp; [<samp>(e3d565e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/e3d565e)
- correct resource name from 'site' to 'sites' in SiteRepository &nbsp;-&nbsp; [<samp>(60e3add)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/60e3add)
- correct type and message for patient endpoints &nbsp;-&nbsp; [<samp>(b97fc5b)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b97fc5b)
- ensure cache invalidation and caching for updated items &nbsp;-&nbsp; [<samp>(b22b3e1)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b22b3e1)
- correct schema import for patient data validation in update endpoint &nbsp;-&nbsp; [<samp>(ceb7686)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ceb7686)
- update consent and identifier defaults for patient and GDPR schemas. Remove default initalization for UUIds &nbsp;-&nbsp; [<samp>(e8e0e3f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/e8e0e3f)
- remove unnecessary await from useStorage and getRouterParam calls &nbsp;-&nbsp; [<samp>(855b661)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/855b661)
- update trial references to patient in post and put handlers &nbsp;-&nbsp; [<samp>(b33fdd0)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b33fdd0)
- assign unique ID to new items during creation &nbsp;-&nbsp; [<samp>(47aae2e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/47aae2e)
- add id field directly in the schema &nbsp;-&nbsp; [<samp>(d57a903)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d57a903)
- enhance error handling in executeWithRetry method of ResilientRepository &nbsp;-&nbsp; [<samp>(f12442d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f12442d)
- improve cache invalidation logic in delete method of CachedRepository &nbsp;-&nbsp; [<samp>(1bada52)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1bada52)
- update ServerResponse type to use NuxtError for error handling &nbsp;-&nbsp; [<samp>(16f1325)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/16f1325)
- define ServerResponse type for improved API response handling &nbsp;-&nbsp; [<samp>(d5fa99f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d5fa99f)
- refactor createZodEnumWithMessage function for better type inference and update SiteStatus to SiteStatusEnum &nbsp;-&nbsp; [<samp>(f13ea40)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f13ea40)
- enhance recordConsent function with additional parameters and improve date handling for GDPR compliance &nbsp;-&nbsp; [<samp>(32f5115)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/32f5115)
- update auditLog function parameters for better type safety and add missing field in auditLogEvent &nbsp;-&nbsp; [<samp>(5cbdd71)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/5cbdd71)
- add missing ui layer &nbsp;-&nbsp; [<samp>(a2ae1cc)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/a2ae1cc)

### 📚 Documentation

- add icon properties to various documentation files for improved navigation &nbsp;-&nbsp; [<samp>(1f4e9d7)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1f4e9d7)
- add icon and navigation properties to model documentation files &nbsp;-&nbsp; [<samp>(c6d3ae3)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c6d3ae3)
- update model documentation headers for consistency and clarity &nbsp;-&nbsp; [<samp>(454709a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/454709a)
- update introduction and deployment descriptions, add new components and repositories documentation, moves files around &nbsp;-&nbsp; [<samp>(2f26a53)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2f26a53)
- refine introduction and enhance installation instructions. visual updates &nbsp;-&nbsp; [<samp>(913fc06)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/913fc06)
- update title and icon for models section &nbsp;-&nbsp; [<samp>(b71671f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b71671f)
- Add enums documentation for each models sections &nbsp;-&nbsp; [<samp>(6cd07c5)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/6cd07c5)
- update field definitions to use v-bind syntax for required field &nbsp;-&nbsp; [<samp>(001fdc8)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/001fdc8)
- Add deployment and development documentation for Euro Clinical Trials application &nbsp;-&nbsp; [<samp>(fccf00e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/fccf00e)
- enhance BaseRepository with detailed method documentation &nbsp;-&nbsp; [<samp>(e43f267)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/e43f267)

### ♻️ Refactoring

- simplify createEntityStore by removing unnecessary generic type &nbsp;-&nbsp; [<samp>(d00e56a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d00e56a)
- standardize parameter naming from trialId to id across endpoints &nbsp;-&nbsp; [<samp>(8124635)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/8124635)
- rename trialId to Id for api route &nbsp;-&nbsp; [<samp>(a79750f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/a79750f)
- enhance createEntityStore to support filtering and improve item management &nbsp;-&nbsp; [<samp>(07be01c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/07be01c)
- update usePatientsStore and useTrialsStore to instantiate repositories directly &nbsp;-&nbsp; [<samp>(efa5e79)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/efa5e79)
- simplify repository creation by consolidating to createResourceRepository function &nbsp;-&nbsp; [<samp>(55bfef9)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/55bfef9)
- refactor PatientsRepository and TrialsRepository to extend ResourceRepository for improved functionality &nbsp;-&nbsp; [<samp>(ff13e9a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ff13e9a)
- update to use the new store API &nbsp;-&nbsp; [<samp>(a530c83)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/a530c83)

### 💄 Styling

- apply formatting &nbsp;-&nbsp; [<samp>(3237d01)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/3237d01)

### 🔧 Chores

- remove test div section from index.md &nbsp;-&nbsp; [<samp>(fa2e35e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/fa2e35e)
- remove unnecessary comment from TrialsRepository constructor &nbsp;-&nbsp; [<samp>(28d0ad4)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/28d0ad4)
- add TrialDataTableDropDown component export &nbsp;-&nbsp; [<samp>(665d409)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/665d409)

