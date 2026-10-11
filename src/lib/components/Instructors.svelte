<script lang="ts">
	const instructors = [
		{
			name: 'Dr. Ahmad Zulkifli',
			role: 'Sharia Finance Expert',
			company: 'DSN-MUI',
			topic: 'Fiqh Muamalah Digital',
			color: 'from-primary-500 to-primary-700',
			photo: 'https://randomuser.me/api/portraits/men/33.jpg'
		},
		{
			name: 'Rina Mardhiana',
			role: 'Blockchain Lead',
			company: 'Tokocrypto',
			topic: 'Blockchain Fundamentals',
			color: 'from-slate-800 to-slate-950',
			photo: 'https://randomuser.me/api/portraits/women/45.jpg'
		},
		{
			name: 'Faisal Rahman',
			role: 'DeFi Analyst',
			company: 'INDODAX',
			topic: 'DeFi & Yield Halal',
			color: 'from-primary-500 to-primary-700',
			photo: 'https://randomuser.me/api/portraits/men/46.jpg'
		},
		{
			name: 'Sari Dewi',
			role: 'Smart Contract Dev',
			company: 'Pintu',
			topic: 'Solidity Development',
			color: 'from-slate-800 to-slate-950',
			photo: 'https://randomuser.me/api/portraits/women/65.jpg'
		},
		{
			name: 'M. Irfan Hakim',
			role: 'Crypto Researcher',
			company: 'Reku',
			topic: 'Token Screening Syariah',
			color: 'from-primary-500 to-primary-700',
			photo: 'https://randomuser.me/api/portraits/men/78.jpg'
		},
		{
			name: 'Nadia Putri',
			role: 'Product Manager',
			company: 'Bank Syariah Indonesia',
			topic: 'Product Management',
			color: 'from-slate-800 to-slate-950',
			photo: 'https://randomuser.me/api/portraits/women/32.jpg'
		}
	];

	let scrollEl: HTMLDivElement;
</script>

<section class="bg-slate-50 py-16 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-4 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white"
		>
			Belajar dari Para Senior Operator
		</h2>
		<p class="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-500 dark:text-gray-400">
			Instruktur berpengalaman dari perusahaan-perusahaan terkemuka di industri crypto dan keuangan
			Syariah.
		</p>

		<div
			bind:this={scrollEl}
			class="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
			style="scrollbar-width: none; -ms-overflow-style: none;"
		>
			{#each instructors as instructor}
				<div class="w-60 flex-shrink-0 snap-start">
					<div
						class="group hover:border-primary-500 hover:shadow-primary-500/20 relative h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
					>
						<!-- Glow effect -->
						<div
							class="bg-primary-500/20 absolute top-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<!-- Avatar area -->
						<div class="relative flex items-center justify-center pt-8 pb-4">
							<img
								src={instructor.photo}
								alt={instructor.name}
								class="border-primary-500/50 group-hover:border-primary-500 relative z-10 h-20 w-20 rounded-full border-2 object-cover shadow-lg transition-colors duration-300"
							/>
						</div>

						<!-- Info -->
						<div class="relative z-10 px-5 pb-6 text-center">
							<h3 class="mb-1 text-sm font-bold text-white">{instructor.name}</h3>
							<p class="text-primary-400 mb-1 text-xs font-medium">{instructor.role}</p>
							<p class="text-xs text-slate-400">@ {instructor.company}</p>

							<div class="mt-5">
								<a
									href="#"
									class="hover:border-primary-500 hover:text-primary-400 hover:bg-primary-500/10 inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 transition-all"
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
