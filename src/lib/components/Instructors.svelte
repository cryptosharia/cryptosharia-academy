<script lang="ts">
	const instructors = [
		{ name: 'Dr. Ahmad Zulkifli', role: 'Sharia Finance Expert', company: 'DSN-MUI', topic: 'Fiqh Muamalah Digital', color: 'from-primary-400 to-primary-600', photo: 'https://randomuser.me/api/portraits/men/33.jpg' },
		{ name: 'Rina Mardhiana', role: 'Blockchain Lead', company: 'Tokocrypto', topic: 'Blockchain Fundamentals', color: 'from-violet-400 to-violet-600', photo: 'https://randomuser.me/api/portraits/women/45.jpg' },
		{ name: 'Faisal Rahman', role: 'DeFi Analyst', company: 'INDODAX', topic: 'DeFi & Yield Halal', color: 'from-blue-400 to-blue-600', photo: 'https://randomuser.me/api/portraits/men/46.jpg' },
		{ name: 'Sari Dewi', role: 'Smart Contract Dev', company: 'Pintu', topic: 'Solidity Development', color: 'from-emerald-400 to-emerald-600', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
		{ name: 'M. Irfan Hakim', role: 'Crypto Researcher', company: 'Reku', topic: 'Token Screening Syariah', color: 'from-accent-400 to-accent-600', photo: 'https://randomuser.me/api/portraits/men/78.jpg' },
		{ name: 'Nadia Putri', role: 'Product Manager', company: 'Bank Syariah Indonesia', topic: 'Product Management', color: 'from-rose-400 to-rose-600', photo: 'https://randomuser.me/api/portraits/women/32.jpg' }
	];

	let scrollEl: HTMLDivElement;
</script>

<section class="py-16 bg-slate-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Belajar dari Para Senior Operator
		</h2>
		<p class="text-center text-slate-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
			Instruktur berpengalaman dari perusahaan-perusahaan terkemuka di industri crypto dan keuangan Syariah.
		</p>

		<div
			bind:this={scrollEl}
			class="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
			style="scrollbar-width: none; -ms-overflow-style: none;"
		>
			{#each instructors as instructor}
				<div class="flex-shrink-0 w-60 snap-start">
					<div class="group h-full rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200">
						<!-- Avatar area -->
						<div class="relative h-44 bg-gradient-to-br {instructor.color} flex items-center justify-center overflow-hidden">
							<div class="absolute inset-0 opacity-10">
								<div class="absolute -top-5 -right-5 w-24 h-24 bg-white rounded-full blur-xl"></div>
							</div>
							<img src={instructor.photo} alt={instructor.name} class="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-lg relative z-10" />
						</div>

						<!-- Info -->
						<div class="p-5">
							<h3 class="font-semibold text-slate-900 dark:text-white text-sm">{instructor.name}</h3>
							<p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{instructor.role}, {instructor.company}</p>
							<a
								href="#"
								class="mt-3 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
							>
								Lihat Materi
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
