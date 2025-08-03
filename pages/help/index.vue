<template>
  <div class="mx-auto px-4 py-8 max-w-6xl container">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="flex items-center gap-3 mb-2 font-bold text-gray-900 text-3xl">
        <CircleHelp class="w-8 h-8 text-blue-600" />
        Help & Support
      </h1>
      <p class="text-gray-600 text-lg">
        Find answers to common questions and learn how to use the Euro Clinical Trials system
      </p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white shadow-sm mb-8 p-6 border rounded-lg">
      <div class="flex items-center gap-4">
        <div class="relative flex-1">
          <Search class="top-3 left-3 absolute w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help articles, tutorials, or FAQs..."
            class="py-3 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-blue-500 w-full"
            @input="filterContent"
          >
        </div>
        <button
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors"
          @click="searchHelp"
        >
          <Search class="w-4 h-4" />
          Search
        </button>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div
        v-for="quickLink in quickLinks"
        :key="quickLink.title"
        class="bg-white hover:shadow-md p-6 border rounded-lg transition-shadow cursor-pointer"
        @click="scrollToSection(quickLink.section)"
      >
        <div class="flex items-center gap-3 mb-3">
          <component
            :is="quickLink.icon"
            class="w-6 h-6 text-blue-600" />
          <h3 class="font-semibold text-gray-900">{{ quickLink.title }}</h3>
        </div>
        <p class="text-gray-600 text-sm">{{ quickLink.description }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="gap-8 grid grid-cols-1 lg:grid-cols-3">
      <!-- Content Area -->
      <div class="space-y-8 lg:col-span-2">
        <!-- Getting Started -->
        <section
          id="getting-started"
          class="bg-white shadow-sm p-6 border rounded-lg">
          <h2 class="flex items-center gap-3 mb-4 font-bold text-gray-900 text-xl">
            <BookOpen class="w-6 h-6 text-green-600" />
            Getting Started
          </h2>
          
          <div class="space-y-4">
            <div class="bg-green-50 p-4 border border-green-200 rounded-lg">
              <h3 class="mb-2 font-semibold text-green-900">Welcome to Euro Clinical Trials</h3>
              <p class="mb-3 text-green-800 text-sm">
                This comprehensive guide will help you get started with managing clinical trials efficiently and compliantly.
              </p>
              <ul class="space-y-2 text-green-800 text-sm">
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-600" />
                  Set up your profile and preferences
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-600" />
                  Create your first clinical trial
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-600" />
                  Add sites and enroll patients
                </li>
                <li class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-green-600" />
                  Ensure GDPR compliance
                </li>
              </ul>
            </div>

            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Quick Start Guide</h4>
              <ol class="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                <li>Navigate to <strong>Settings</strong> to configure your profile and preferences</li>
                <li>Go to <strong>Trials → Create Trial</strong> to set up your first study</li>
                <li>Add study sites in <strong>Sites → Create Site</strong></li>
                <li>Enroll participants through <strong>Patients → Create Patient</strong></li>
                <li>Monitor compliance and generate reports</li>
              </ol>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section
          id="faq"
          class="bg-white shadow-sm p-6 border rounded-lg">
          <h2 class="flex items-center gap-3 mb-6 font-bold text-gray-900 text-xl">
            <HelpCircle class="w-6 h-6 text-blue-600" />
            Frequently Asked Questions
          </h2>

          <div class="space-y-4">
            <div
              v-for="(faq, index) in filteredFaqs"
              :key="index"
              class="border border-gray-200 rounded-lg"
            >
              <button
                class="flex justify-between items-center hover:bg-gray-50 p-4 w-full text-left transition-colors"
                @click="toggleFaq(index)"
              >
                <span class="font-medium text-gray-900">{{ faq.question }}</span>
                <ChevronDown
                  :class="['h-5 w-5 text-gray-500 transition-transform', openFaqs.includes(index) ? 'rotate-180' : '']"
                />
              </button>
              <div
                v-if="openFaqs.includes(index)"
                class="p-4 border-gray-200 border-t"
              >
                <p class="text-gray-600 text-sm">
                  {{ faq.answer.replace(/<\/?strong>/g, '') }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- User Guides -->
        <section
          id="user-guides"
          class="bg-white shadow-sm p-6 border rounded-lg">
          <h2 class="flex items-center gap-3 mb-6 font-bold text-gray-900 text-xl">
            <FileText class="w-6 h-6 text-purple-600" />
            User Guides
          </h2>

          <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div
              v-for="guide in userGuides"
              :key="guide.title"
              class="p-4 border border-gray-200 hover:border-purple-300 rounded-lg transition-colors cursor-pointer"
              @click="openGuide(guide)"
            >
              <div class="flex items-start gap-3">
                <component
                  :is="guide.icon"
                  class="flex-shrink-0 mt-1 w-5 h-5 text-purple-600" />
                <div>
                  <h3 class="mb-1 font-medium text-gray-900">{{ guide.title }}</h3>
                  <p class="mb-2 text-gray-600 text-sm">{{ guide.description }}</p>
                  <span class="text-purple-600 text-xs">{{ guide.duration }} read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Support -->
        <section
          id="contact"
          class="bg-white shadow-sm p-6 border rounded-lg">
          <h2 class="flex items-center gap-3 mb-6 font-bold text-gray-900 text-xl">
            <MessageCircle class="w-6 h-6 text-orange-600" />
            Contact Support
          </h2>

          <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Mail class="flex-shrink-0 mt-1 w-5 h-5 text-orange-600" />
                <div>
                  <h3 class="font-medium text-gray-900">Email Support</h3>
                  <p class="text-gray-600 text-sm">Get help via email</p>
                  <a
                    href="mailto:support@euroclinicaltrials.com"
                    class="text-orange-600 text-sm hover:underline">
                    support@euroclinicaltrials.com
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Phone class="flex-shrink-0 mt-1 w-5 h-5 text-orange-600" />
                <div>
                  <h3 class="font-medium text-gray-900">Phone Support</h3>
                  <p class="text-gray-600 text-sm">Mon-Fri, 9 AM - 6 PM CET</p>
                  <a
                    href="tel:+331234567890"
                    class="text-orange-600 text-sm hover:underline">
                    +33 1 23 45 67 890
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Globe class="flex-shrink-0 mt-1 w-5 h-5 text-orange-600" />
                <div>
                  <h3 class="font-medium text-gray-900">Documentation</h3>
                  <p class="text-gray-600 text-sm">Comprehensive documentation</p>
                  <a
                    href="#"
                    class="text-orange-600 text-sm hover:underline">
                    docs.euroclinicaltrials.com
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-orange-50 p-4 border border-orange-200 rounded-lg">
              <h3 class="mb-3 font-medium text-orange-900">Emergency Support</h3>
              <p class="mb-3 text-orange-800 text-sm">
                For critical issues affecting patient safety or data integrity, contact our emergency hotline:
              </p>
              <div class="flex items-center gap-2">
                <AlertTriangle class="w-4 h-4 text-orange-600" />
                <a
                  href="tel:+33123456789"
                  class="font-medium text-orange-900 hover:underline">
                  +33 1 23 45 67 89
                </a>
              </div>
              <p class="mt-2 text-orange-700 text-xs">Available 24/7</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- System Status -->
        <div class="bg-white shadow-sm p-6 border rounded-lg">
          <h3 class="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <Activity class="w-5 h-5 text-green-600" />
            System Status
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">API Services</span>
              <span class="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle class="w-4 h-4" />
                Operational
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Database</span>
              <span class="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle class="w-4 h-4" />
                Operational
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">File Storage</span>
              <span class="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle class="w-4 h-4" />
                Operational
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Updates -->
        <div class="bg-white shadow-sm p-6 border rounded-lg">
          <h3 class="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <Bell class="w-5 h-5 text-blue-600" />
            Recent Updates
          </h3>
          <div class="space-y-3">
            <div class="text-sm">
              <div class="font-medium text-gray-900">v2.1.0 Released</div>
              <div class="text-gray-600">Enhanced GDPR compliance tools</div>
              <div class="text-gray-400 text-xs">2 days ago</div>
            </div>
            <div class="text-sm">
              <div class="font-medium text-gray-900">New Feature</div>
              <div class="text-gray-600">Automated adverse event reporting</div>
              <div class="text-gray-400 text-xs">1 week ago</div>
            </div>
            <div class="text-sm">
              <div class="font-medium text-gray-900">Security Update</div>
              <div class="text-gray-600">Enhanced authentication system</div>
              <div class="text-gray-400 text-xs">2 weeks ago</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow-sm p-6 border rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-900">Quick Actions</h3>
          <div class="space-y-2">
            <button
              class="flex items-center gap-2 hover:bg-gray-50 p-2 rounded w-full text-left transition-colors"
              @click="downloadUserManual"
            >
              <Download class="w-4 h-4 text-gray-600" />
              <span class="text-gray-700 text-sm">Download User Manual</span>
            </button>
            <button
              class="flex items-center gap-2 hover:bg-gray-50 p-2 rounded w-full text-left transition-colors"
              @click="scheduleTraining"
            >
              <Calendar class="w-4 h-4 text-gray-600" />
              <span class="text-gray-700 text-sm">Schedule Training</span>
            </button>
            <button
              class="flex items-center gap-2 hover:bg-gray-50 p-2 rounded w-full text-left transition-colors"
              @click="submitFeedback"
            >
              <MessageSquare class="w-4 h-4 text-gray-600" />
              <span class="text-gray-700 text-sm">Submit Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, Search, BookOpen, HelpCircle, FileText, MessageCircle,
  CheckCircle, ChevronDown, Mail, Phone, Globe, AlertTriangle, Activity,
  Bell, Download, Calendar, MessageSquare, FlaskConical, UserRoundIcon,
  MapPinIcon, Shield, Users
} from 'lucide-vue-next'

// Page metadata
definePageMeta({
    layout: 'simple',
  title: 'Help & Support',
  description: 'Find answers to common questions and learn how to use the Euro Clinical Trials system'
})

// Reactive data
const searchQuery = ref('')
const openFaqs = ref<number[]>([])

// Quick links configuration
const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using the system',
    icon: BookOpen,
    section: 'getting-started'
  },
  {
    title: 'FAQ',
    description: 'Find answers to common questions',
    icon: HelpCircle,
    section: 'faq'
  },
  {
    title: 'User Guides',
    description: 'Detailed step-by-step tutorials',
    icon: FileText,
    section: 'user-guides'
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: MessageCircle,
    section: 'contact'
  }
]

// FAQ data
const faqs = [
  {
    question: 'How do I create a new clinical trial?',
    answer: 'Navigate to <strong>Trials → Create Trial</strong> in the main menu. Fill in the required information including study title, phase, primary endpoint, and regulatory details. The system will guide you through GDPR compliance requirements and EudraCT registration if applicable.'
  },
  {
    question: 'What are the GDPR compliance requirements?',
    answer: 'All clinical trials must comply with GDPR regulations. This includes obtaining proper consent forms, ensuring data minimization, implementing data protection by design, and maintaining audit trails. The system automatically checks compliance status and provides guidance on requirements.'
  },
  {
    question: 'How do I enroll a new patient?',
    answer: 'Go to <strong>Patients → Create Patient</strong>. Enter patient demographics, ensure consent forms are completed, and assign them to the appropriate trial and site. The system will automatically generate a unique patient ID and check eligibility criteria.'
  },
  {
    question: 'How do I report an adverse event?',
    answer: 'Navigate to <strong>Adverse Events → Report Event</strong>. Fill in the event details including severity, causality assessment, and timeline. The system will automatically determine reporting requirements based on the event severity and study phase.'
  },
  {
    question: 'Can I export trial data?',
    answer: 'Yes, trial data can be exported in various formats (CSV, PDF, XML) through the export function available in each module. Exports include audit trails and comply with regulatory requirements for data integrity.'
  },
  {
    question: 'How do I manage user permissions?',
    answer: 'User permissions are managed through the <strong>Users</strong> section. Administrators can assign role-based permissions including Principal Investigator, Study Coordinator, Data Manager, and Monitor roles with specific access levels.'
  },
  {
    question: 'What browsers are supported?',
    answer: 'The system supports all modern browsers including Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend using the latest browser versions for optimal performance and security.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Use the "Forgot Password" link on the login page, or contact your system administrator. For security reasons, passwords must meet complexity requirements including minimum length and character diversity.'
  }
]

// User guides
const userGuides = [
  {
    title: 'Trial Setup Guide',
    description: 'Complete guide to setting up a new clinical trial',
    icon: FlaskConical,
    duration: '15 min',
    url: '/guides/trial-setup'
  },
  {
    title: 'Patient Management',
    description: 'How to enroll and manage patients effectively',
    icon: UserRoundIcon,
    duration: '10 min',
    url: '/guides/patient-management'
  },
  {
    title: 'Site Administration',
    description: 'Managing study sites and personnel',
    icon: MapPinIcon,
    duration: '12 min',
    url: '/guides/site-administration'
  },
  {
    title: 'GDPR Compliance',
    description: 'Ensuring full GDPR compliance in clinical trials',
    icon: Shield,
    duration: '20 min',
    url: '/guides/gdpr-compliance'
  },
  {
    title: 'User Management',
    description: 'Adding and managing system users',
    icon: Users,
    duration: '8 min',
    url: '/guides/user-management'
  },
  {
    title: 'Adverse Event Reporting',
    description: 'Comprehensive guide to AE reporting',
    icon: AlertTriangle,
    duration: '18 min',
    url: '/guides/adverse-events'
  }
]

// Computed property for filtered FAQs
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(query) || 
    faq.answer.toLowerCase().includes(query)
  )
})

// Methods
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleFaq = (index: number) => {
  const currentIndex = openFaqs.value.indexOf(index)
  if (currentIndex > -1) {
    openFaqs.value.splice(currentIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const filterContent = () => {
  // This method is called on input to trigger reactivity
  // The actual filtering is handled by the computed property
}

const searchHelp = () => {
  // TODO: Implement advanced search functionality
  console.log('Searching for:', searchQuery.value)
}

interface UserGuide {
  title: string
  description: string
  icon: typeof FlaskConical
  duration: string
  url: string
}

const openGuide = (guide: UserGuide) => {
  // TODO: Navigate to guide or open in modal
  console.log('Opening guide:', guide.title)
  // navigateTo(guide.url)
}

const downloadUserManual = () => {
  // TODO: Implement download functionality
  console.log('Downloading user manual...')
}

const scheduleTraining = () => {
  // TODO: Implement training scheduling
  console.log('Scheduling training...')
}

const submitFeedback = () => {
  // TODO: Open feedback form
  console.log('Opening feedback form...')
}
</script>
