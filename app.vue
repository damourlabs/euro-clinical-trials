<template>
  <NuxtLayout v-bind="sidebarProps">
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { CircleHelp, Cog, FlaskConical, LayoutDashboardIcon, UserRoundIcon, MapPinIcon } from 'lucide-vue-next';
import type { NavigationSidebarProps } from '~ui/components/nav/SideBar.vue';


const sidebarProps = ref<NavigationSidebarProps>({
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
  }
})


const patientsStore = usePatientsStore()
const trialsStore = useTrialsStore()
const sitesStore = useSitesStore()

provide('patientsStore', patientsStore)
provide('trialsStore', trialsStore)
provide('sitesStore', sitesStore)


</script>