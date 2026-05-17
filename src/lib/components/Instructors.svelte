<script lang="ts">
	const instructors = [
		{ name: 'Dr. Ahmad Zulkifli', role: 'Sharia Finance Expert', company: 'DSN-MUI', topic: 'Fiqh Muamalah Digital', color: 'from-primary-500 to-primary-700', photo: 'https://randomuser.me/api/portraits/men/33.jpg' },
		{ name: 'Rina Mardhiana', role: 'Blockchain Lead', company: 'Tokocrypto', topic: 'Blockchain Fundamentals', color: 'from-slate-800 to-slate-950', photo: 'https://randomuser.me/api/portraits/women/45.jpg' },
		{ name: 'Faisal Rahman', role: 'DeFi Analyst', company: 'INDODAX', topic: 'DeFi & Yield Halal', color: 'from-primary-500 to-primary-700', photo: 'https://randomuser.me/api/portraits/men/46.jpg' },
		{ name: 'Sari Dewi', role: 'Smart Contract Dev', company: 'Pintu', topic: 'Solidity Development', color: 'from-slate-800 to-slate-950', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
		{ name: 'M. Irfan Hakim', role: 'Crypto Researcher', company: 'Reku', topic: 'Token Screening Syariah', color: 'from-primary-500 to-primary-700', photo: 'https://randomuser.me/api/portraits/men/78.jpg' },
		{ name: 'Nadia Putri', role: 'Product Manager', company: 'Bank Syariah Indonesia', topic: 'Product Management', color: 'from-slate-800 to-slate-950', photo: 'https://randomuser.me/api/portraits/women/32.jpg' }
	];

	let scrollEl: HTMLDivElement;
</script>

<section class="py-16 bg-slate-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Belajar dari Para Senior Operator
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
			Instruktur berpengalaman dari perusahaan-perusahaan terkemuka di industri crypto dan keuangan Syariah.
		</p>

		<div
			bind:this={scrollEl}
			class="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
			style="scrollbar-width: none; -ms-overflow-style: none;"
		>
			{#each instructors as instructor}
				<div class="flex-shrink-0 w-60 snap-start">
					<div class="group relative h-full rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1">
						<!-- Glow effect -->
						<div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						
						<!-- Avatar area -->
						<div class="relative pt-8 pb-4 flex items-center justify-center">
							<img src={instructor.photo} alt={instructor.name} class="w-20 h-20 rounded-full object-cover border-2 border-primary-500/50 shadow-lg relative z-10 group-hover:border-primary-500 transition-colors duration-300" />
						</div>

						<!-- Info -->
						<div class="px-5 pb-6 text-center relative z-10">
							<h3 class="font-bold text-white text-sm mb-1">{instructor.name}</h3>
							<p class="text-xs text-primary-400 font-medium mb-1">{instructor.role}</p>
							<p class="text-xs text-slate-400">@ {instructor.company}</p>
							
							<div class="mt-5">
								<a
									href="#"
									class="inline-flex items-center justify-center w-full rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
								>
									Lihat Profil
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
