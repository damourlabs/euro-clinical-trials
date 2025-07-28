<template>
  <NuxtLayout >
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { LayoutDashboardIcon, FlaskConical, UserRoundIcon, MapPinIcon, Cog, CircleHelp } from 'lucide-vue-next'
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
  ],
  links: [
    { name: 'Settings', url: '/dashboard/settings', icon: Cog },
    { name: 'Help', url: '/dashboard/help', icon: CircleHelp },
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

provide('patientsStore', patientsStore)
provide('trialsStore', trialsStore)
provide('sitesStore', sitesStore)
provide('protocolsStore', protocolStore)
provide('usersStore', usersStore)

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