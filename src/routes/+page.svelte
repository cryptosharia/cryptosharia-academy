<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';
	import Programs from '$lib/components/Programs.svelte';
	import CommunityGallery from '$lib/components/CommunityGallery.svelte';
	import Instructors from '$lib/components/Instructors.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import Investors from '$lib/components/Investors.svelte';
	import FeaturedIn from '$lib/components/FeaturedIn.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import SyariahPrinciples from '$lib/components/SyariahPrinciples.svelte';
</script>

<svelte:head>
	<title>CryptoSharia Academy | Platform Edukasi Crypto Syariah #1</title>
	<meta name="description" content="Bangun karir di industri crypto syariah Indonesia. Belajar langsung dari praktisi Web3, bangun jaringan, dan akses peluang tanpa harus paham coding." />
</svelte:head>

<Hero />
<StatsBar />
<SyariahPrinciples />
<Testimonials />
<Programs />
<CommunityGallery />
<Instructors />
<Partners />
<Investors />
<FeaturedIn />
<FAQ />
