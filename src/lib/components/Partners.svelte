<script lang="ts">
	const partners = [
		{ name: 'Tokocrypto', domain: 'tokocrypto.com' },
		{ name: 'INDODAX', domain: 'indodax.com' },
		{ name: 'Pintu', domain: 'pintu.co.id' },
		{ name: 'Reku', domain: 'reku.id' },
		{ name: 'BSI', domain: 'bankbsi.co.id' },
		{ name: 'Astra Financial', domain: 'astrafinancial.co.id' }
	];
</script>

<section class="py-16 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Bersama Experts dan Case Study dari Notable Companies
		</h2>
		<p class="text-center text-slate-500 dark:text-gray-400 mb-12">
			Materi disusun bersama para praktisi dari perusahaan terkemuka.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
			{#each partners as partner}
				<div class="group flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary-50 hover:shadow-sm">
					<img 
						src="https://logo.clearbit.com/{partner.domain}" 
						alt="{partner.name} logo" 
						class="h-8 md:h-10 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
						onerror={(e) => { const el = e.currentTarget; el.onerror = null; el.src = `https://ui-avatars.com/api/?name=${partner.name}&background=f8fafc&color=64748b&bold=true`; }}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
