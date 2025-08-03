<template>
  <NuxtLayout >
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { LayoutDashboardIcon, FlaskConical, UserRoundIcon, MapPinIcon, Cog, CircleHelp, FileText, AlertTriangle, Shield, Users } from 'lucide-vue-next'
import type { FooterProps } from '~ui/components/nav/Footer.vue'
import type { NavigationSidebarProps } from '~ui/components/nav/SideBar.vue'


const { updateNavigationConfig } = useNavigation();
const { updateFooterConfig } = useFooter();

// Update the navigation configuration with the provided props
onMounted(() => {
  updateNavigationConfig(sidebarProps.value);
  updateFooterConfig(footerProps.value);
});


// provide('updateNavigationConfig', updateNavigationConfig);

const sidebarProps = ref<NavigationSidebarProps>({
  hasBreadcrumbs: true,
  mainMenuUrl: '/',
  items: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
      items: [
        { title: 'Overview', url: '/dashboard', isActive: true },
        { title: 'Statistics', url: '/dashboard/statistics', isActive: false },
      ],
    },
    {
      title: 'Trials',
      icon: FlaskConical,
      url: '/trials',
      items: [
        { title: 'All Trials', url: '/trials', isActive: false },
        { title: 'Create Trial', url: '/trials/create', isActive: false },
      ],
    },
    {
      title: 'Patients',
      icon: UserRoundIcon,
      url: '/patients',
      items: [
        { title: 'All Patients', url: '/patients', isActive: false },
        { title: 'Dashboard', url: '/patients/dashboard', isActive: false },
        { title: 'Create Patient', url: '/patients/create', isActive: false },
      ],
    },
    {
      title: 'Sites',
      icon: MapPinIcon,
      url: '/sites',
      items: [
        { title: 'All Sites', url: '/sites', isActive: false },
        { title: 'Create Site', url: '/sites/create', isActive: false },
      ],
    },
    {
      title: 'Users',
      icon: Users,
      url: '/users',
      items: [
        { title: 'All Users', url: '/users', isActive: false },
        { title: 'Create User', url: '/users/create', isActive: false },
      ],
    },
    {
      title: 'Protocols',
      icon: FileText,
      url: '/protocols',
      items: [
        { title: 'All Protocols', url: '/protocols', isActive: false },
        { title: 'Create Protocol', url: '/protocols/create', isActive: false },
      ],
    },
    {
      title: 'Audits',
      icon: Shield,
      url: '/audits',
      items: [
        { title: 'All Audits', url: '/audits', isActive: false },
        { title: 'Create Audit', url: '/audits/create', isActive: false },
      ],
    },
    {
      title: 'Adverse Events',
      icon: AlertTriangle,
      url: '/adverse-events',
      items: [
        { title: 'All Events', url: '/adverse-events', isActive: false },
        { title: 'Report Event', url: '/adverse-events/create', isActive: false },
      ],
    },
  ],
  links: [
    { name: 'Settings', url: '/settings', icon: Cog },
    { name: 'Help', url: '/help', icon: CircleHelp },
  ],
  user: {
    name: ' ',
    email: '',
    avatar: '',
  },
})

const patientsStore = usePatientsStore()
const trialsStore = useTrialsStore()
const sitesStore = useSitesStore()
const protocolStore = useProtocolsStore()
const usersStore = useUsersStore()
const auditsStore = useAuditsStore()
const adverseEventsStore = useAdverseEventsStore()

provide('patientsStore', patientsStore)
provide('trialsStore', trialsStore)
provide('sitesStore', sitesStore)
provide('protocolsStore', protocolStore)
provide('usersStore', usersStore)
provide('auditsStore', auditsStore)
provide('adverseEventsStore', adverseEventsStore)

const footerProps = ref<FooterProps>({
  credits: `© ${new Date().getFullYear()} Euro Clinical Trials`,
  links: [
    { name: 'Privacy Policy', url: '/privacy', icon: CircleHelp },
    { name: 'Terms of Service', url: '/terms', icon: CircleHelp },
    { name: 'Contact Us', url: '/contact', icon: CircleHelp },
    { name: 'About Us', url: '/about', icon: CircleHelp },
  ],
})

</script>