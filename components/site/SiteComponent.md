# SiteComponent Enhancement Documentation

## Overview

The `SiteComponent.vue` has been completely refactored to work with the new database schema structure. This document outlines the changes made and provides usage examples.

## Key Changes Made

### 1. Schema Compatibility Updates

#### Primary Key Changes
- **Old**: `site.id` → **New**: `site.uuid`
- **Old**: `site.trialId` → **New**: `site.trialUuid`

#### User Reference Changes
The component now handles user references as UUIDs instead of nested objects:
- **Old**: `site.principalInvestigator.name` 
- **New**: `principalInvestigator?.name` (passed as separate prop)

#### Data Type Updates
- **Data Completeness**: Now handles string values (decimal) instead of numbers
- **Enum Values**: Updated to match new schema (e.g., `OnTime` instead of `onTime`)

### 2. New Props Structure

The component now accepts the following props:

```typescript
interface Props {
  site: Site | undefined
  certifications?: SiteCertification[]      // NEW: Separate certifications data
  documents?: Document[]                     // NEW: Separate documents data
  principalInvestigator?: User              // NEW: Resolved user object
  contactPerson?: User                      // NEW: Resolved user object
  studyCoordinator?: User                   // NEW: Resolved user object
  users?: User[]                           // NEW: Array for document uploader lookup
}
```

### 3. Enhanced Features

#### Certifications Display
- Now shows detailed certification information including issue and expiry dates
- Proper handling of the separate `SiteCertification` table

#### Documents Management
- Enhanced document display with proper metadata
- Added "View Document" functionality
- Proper handling of the separate `Document` table

#### User Information
- Graceful handling of missing user data
- Fallback displays for unassigned roles

### 4. Updated Enum Mappings

#### Site Status
- `Active`, `Inactive`, `Pending`, `Closed`

#### Data Submission Status
- `OnTime`, `Delayed`, `NotSubmitted`

#### Facility Types
- `Hospital`, `Clinic`, `University`, `ResearchCenter`

#### Document Types
- `Protocol`, `InformedConsent`, `RegulatoryApproval`, `Other`

## Usage Examples

### Basic Usage (Single Site)

```vue
<template>
  <SiteComponent 
    :site="site"
    :certifications="siteCertifications"
    :documents="siteDocuments"
    :principal-investigator="principalInvestigator"
    :contact-person="contactPerson"
    :study-coordinator="studyCoordinator"
    :users="allUsers"
  />
</template>

<script setup>
// Fetch site data with related information
const { data: siteData } = await $fetch(`/api/sites/${siteId}`, {
  query: {
    include: ['certifications', 'documents', 'users']
  }
})

// Extract related data
const site = siteData.site
const siteCertifications = siteData.certifications
const siteDocuments = siteData.documents
const allUsers = siteData.users

// Find specific users
const principalInvestigator = allUsers.find(u => u.uuid === site.principalInvestigatorUuid)
const contactPerson = allUsers.find(u => u.uuid === site.contactPersonUuid)
const studyCoordinator = site.studyCoordinatorUuid 
  ? allUsers.find(u => u.uuid === site.studyCoordinatorUuid) 
  : undefined
</script>
```

### Page Component Integration

```vue
<!-- pages/sites/[uuid].vue -->
<template>
  <div class="container mx-auto py-6">
    <SiteComponent 
      v-if="!pending && siteData"
      :site="siteData.site"
      :certifications="siteData.certifications"
      :documents="siteData.documents"
      :principal-investigator="siteData.principalInvestigator"
      :contact-person="siteData.contactPerson"
      :study-coordinator="siteData.studyCoordinator"
      :users="siteData.users"
    />
    <div v-else-if="pending" class="text-center py-8">
      <p>Loading site information...</p>
    </div>
    <div v-else class="text-center py-8">
      <p>Site not found</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const siteUuid = route.params.uuid

const { data: siteData, pending } = await useFetch(`/api/sites/${siteUuid}`, {
  transform: (data: any) => ({
    site: data.site,
    certifications: data.certifications || [],
    documents: data.documents || [],
    principalInvestigator: data.users?.find((u: any) => u.uuid === data.site.principalInvestigatorUuid),
    contactPerson: data.users?.find((u: any) => u.uuid === data.site.contactPersonUuid),
    studyCoordinator: data.site.studyCoordinatorUuid 
      ? data.users?.find((u: any) => u.uuid === data.site.studyCoordinatorUuid)
      : undefined,
    users: data.users || []
  })
})
</script>
```

## API Endpoint Requirements

Your API endpoints should return data in this structure:

```typescript
// GET /api/sites/[uuid]
interface SiteDetailResponse {
  site: Site
  certifications: SiteCertification[]
  documents: Document[]
  users: User[] // All related users for this site
}
```

Example API response:
```json
{
  "site": {
    "uuid": "site-uuid-here",
    "trialUuid": "trial-uuid-here",
    "name": "Memorial Hospital Clinical Site",
    "address": "123 Medical Drive, Health City, HC 12345",
    "contactPersonUuid": "user-uuid-1",
    "principalInvestigatorUuid": "user-uuid-2",
    "studyCoordinatorUuid": "user-uuid-3",
    "facilityType": "Hospital",
    "status": "Active",
    "patientsEnrolled": 45,
    "targetEnrollment": 100,
    "dataSubmissionStatus": "OnTime",
    "activationDate": "2024-01-15",
    "dataCompleteness": "85.50",
    "lastMonitoringVisit": "2024-07-01",
    "nextScheduledVisit": "2024-08-15",
    "protocolDeviations": 2,
    "adverseEventsReported": 1
  },
  "certifications": [
    {
      "uuid": "cert-uuid-1",
      "siteUuid": "site-uuid-here",
      "certificationName": "GCP Certification",
      "issuedDate": "2024-01-01",
      "expiryDate": "2025-01-01"
    }
  ],
  "documents": [
    {
      "uuid": "doc-uuid-1",
      "title": "Site Activation Protocol",
      "url": "https://storage.example.com/documents/site-activation.pdf",
      "documentType": "Protocol",
      "description": "Site activation protocol and procedures",
      "uploadDate": "2024-01-10",
      "uploadedBy": "user-uuid-4",
      "siteUuid": "site-uuid-here"
    }
  ],
  "users": [
    {
      "uuid": "user-uuid-1",
      "name": "Dr. Sarah Johnson",
      "email": "sarah.johnson@memorial.com",
      "institution": "Memorial Hospital",
      "role": "Investigator"
    },
    {
      "uuid": "user-uuid-2",
      "name": "Dr. Michael Chen",
      "email": "michael.chen@memorial.com", 
      "institution": "Memorial Hospital",
      "role": "Investigator"
    }
  ]
}
```

## Migration Notes

### For Existing Implementations

1. **Update API calls** to fetch related data (certifications, documents, users)
2. **Update prop passing** to use new structure
3. **Test user role assignments** to ensure proper display
4. **Verify document viewing** functionality works with your storage system

### Database Query Considerations

When fetching site data, ensure you're joining the related tables:

```sql
-- Example query structure
SELECT 
  s.*,
  sc.*, -- site certifications
  d.*,  -- documents
  u.*   -- users
FROM sites s
LEFT JOIN site_certifications sc ON s.uuid = sc.site_uuid
LEFT JOIN documents d ON s.uuid = d.site_uuid
LEFT JOIN users u ON (
  s.contact_person_uuid = u.uuid OR 
  s.principal_investigator_uuid = u.uuid OR 
  s.study_coordinator_uuid = u.uuid OR
  d.uploaded_by = u.uuid
)
WHERE s.uuid = $1;
```

## Benefits of the Enhanced Component

1. **Better Separation of Concerns**: Data fetching is separated from presentation
2. **Improved Performance**: Related data can be fetched efficiently
3. **Enhanced User Experience**: Better handling of missing data and loading states
4. **Future-Proof**: Easily extensible for additional related data
5. **Type Safety**: Full TypeScript support with proper type definitions

## Troubleshooting

### Common Issues

1. **Missing User Data**: Ensure all user UUIDs in the site object have corresponding user records
2. **Document Viewing Errors**: Verify document URLs are accessible and properly formatted
3. **Date Formatting Issues**: Ensure date strings are in proper ISO format
4. **Certification Display**: Check that certification data includes all required fields

### Debug Tips

```typescript
// Add debug logging to track data flow
console.log('Site data:', site)
console.log('Principal Investigator:', principalInvestigator)
console.log('Certifications:', certifications)
console.log('Documents:', documents)
```
