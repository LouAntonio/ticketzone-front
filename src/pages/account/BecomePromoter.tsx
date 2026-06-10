import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useBecomePromoter } from '../../api/hooks/useAccount'
import { useCloudinaryUpload } from '../../api/hooks/useCloudinaryUpload'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { toast } from 'react-hot-toast'
import type { DocFile } from '../../types/auth'

export function BecomePromoterPage() {
	const user = useAuthStore((s) => s.user)
	const navigate = useNavigate()
	const becomePromoter = useBecomePromoter()

	const [hasPendingRequest, setHasPendingRequest] = useState(false)
	const [pendingStatus, setPendingStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | null>(
		null,
	)
	const [form, setForm] = useState({
		companyName: '',
		promoterType: '' as 'PESSOAL' | 'EMPRESARIAL' | '',
		nif: '',
		iban: '',
	})
	const [personalFiles, setPersonalFiles] = useState<File[]>([])
	const [enterpriseFiles, setEnterpriseFiles] = useState<File[]>([])
	const [logoFile, setLogoFile] = useState<File | null>(null)
	const [bannerFile, setBannerFile] = useState<File | null>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const [bannerPreview, setBannerPreview] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const cloudinaryUpload = useCloudinaryUpload()
	const personalInputRef = useRef<HTMLInputElement>(null)
	const enterpriseInputRef = useRef<HTMLInputElement>(null)
	const logoInputRef = useRef<HTMLInputElement>(null)
	const bannerInputRef = useRef<HTMLInputElement>(null)

	const addFiles = (category: 'personal' | 'enterprise', files: FileList | null) => {
		if (!files) return
		const setter = category === 'personal' ? setPersonalFiles : setEnterpriseFiles
		setter((prev) => [...prev, ...Array.from(files)])
	}

	const removeFile = (category: 'personal' | 'enterprise', index: number) => {
		const setter = category === 'personal' ? setPersonalFiles : setEnterpriseFiles
		setter((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSingleFile = (
		file: File | null,
		setter: (f: File | null) => void,
		previewSetter: (s: string | null) => void,
	) => {
		if (!file) return
		setter(file)
		const reader = new FileReader()
		reader.onloadend = () => previewSetter(reader.result as string)
		reader.readAsDataURL(file)
	}

	const isPromoter = user?.role === 'PROMOTER'
	const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN'

	if (isPromoter || isStaff) {
		return (
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="stagger-1">
					<h1 className="font-display-alt font-700 text-3xl text-warm-text">
						Tornar-me Promotor
					</h1>
				</div>
				<div className="card-account stagger-2 text-center p-12">
					<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
						<svg
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#065f46"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</div>
					<h2 className="font-display-alt text-2xl font-700 text-warm-text mb-2">
						{isPromoter ? 'Já és Promotor!' : 'Conta de Administrador'}
					</h2>
					<p className="text-text-secondary mb-6 max-w-md mx-auto">
						{isPromoter
							? 'A tua conta já tem acesso ao painel de organizador. Podes criar e gerir eventos.'
							: 'Administradores e staff não precisam de se tornar promotores.'}
					</p>
					{isPromoter && (
						<Button onClick={() => navigate('/organizer')}>
							Ir para o Painel Organizador
						</Button>
					)}
				</div>
			</div>
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!form.companyName.trim()) {
			toast.error('O nome da empresa é obrigatório')
			return
		}

		if (!form.promoterType) {
			toast.error('Seleciona o tipo de promotor')
			return
		}

		if (form.promoterType === 'EMPRESARIAL' && !form.nif.trim()) {
			toast.error('NIF é obrigatório para promotores empresariais')
			return
		}

		setUploading(true)
		setUploadProgress(0)

		try {
			const personalDocs: DocFile[] = []
			const enterpriseDocs: DocFile[] = []
			let logo: DocFile | undefined
			let banner: DocFile | undefined

			const filesToUpload: { file: File; folder: string; dest: DocFile[] | null }[] = []
			let totalFiles = 0

			if (form.promoterType === 'PESSOAL') {
				for (const f of personalFiles) {
					filesToUpload.push({
						file: f,
						folder: 'promotores/pessoal',
						dest: personalDocs,
					})
				}
			} else {
				for (const f of enterpriseFiles) {
					filesToUpload.push({
						file: f,
						folder: 'promotores/empresa',
						dest: enterpriseDocs,
					})
				}
			}

			if (logoFile) {
				filesToUpload.push({ file: logoFile, folder: 'promotores/logo', dest: null })
			}
			if (bannerFile) {
				filesToUpload.push({ file: bannerFile, folder: 'promotores/banner', dest: null })
			}

			totalFiles = filesToUpload.length

			for (let i = 0; i < filesToUpload.length; i++) {
				const { file, folder, dest } = filesToUpload[i]
				const doc = await cloudinaryUpload.upload(file, folder)
				if (dest) {
					dest.push(doc)
				} else if (folder === 'promotores/logo') {
					logo = doc
				} else if (folder === 'promotores/banner') {
					banner = doc
				}
				setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))
			}

			await becomePromoter.mutateAsync({
				companyName: form.companyName,
				promoterType: form.promoterType,
				nif: form.nif || undefined,
				iban: form.iban || undefined,
				personalDocs: personalDocs.length > 0 ? personalDocs : undefined,
				enterpriseDocs: enterpriseDocs.length > 0 ? enterpriseDocs : undefined,
				logo,
				banner,
			})
			setHasPendingRequest(true)
			setPendingStatus('PENDING')
		} catch {
			// Error already handled by toast in hook
		} finally {
			setUploading(false)
			setUploadProgress(0)
		}
	}

	if (hasPendingRequest) {
		return (
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="stagger-1">
					<h1 className="font-display-alt font-700 text-3xl text-warm-text">
						Tornar-me Promotor
					</h1>
				</div>

				{pendingStatus === 'PENDING' && (
					<div className="card-account stagger-2">
						<div className="p-8 text-center">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
								<svg
									width="40"
									height="40"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#d97706"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z" />
								</svg>
							</div>
							<h2 className="font-display-alt text-2xl font-700 text-warm-text mb-2">
								Pedido em Análise
							</h2>
							<p className="text-text-secondary mb-2 max-w-md mx-auto">
								O teu pedido para se tornar promotor foi recebido e está a ser
								analisado pela nossa equipa.
							</p>
							<p className="text-xs text-text-secondary">
								Receberás uma notificação por email quando o teu pedido for
								aprovado.
							</p>
						</div>
					</div>
				)}

				{pendingStatus === 'REJECTED' && (
					<div className="card-account stagger-2">
						<div className="p-8 text-center">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
								<svg
									width="40"
									height="40"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#dc2626"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="15" y1="9" x2="9" y2="15" />
									<line x1="9" y1="9" x2="15" y2="15" />
								</svg>
							</div>
							<h2 className="font-display-alt text-2xl font-700 text-warm-text mb-2">
								Pedido Não Aprovado
							</h2>
							<p className="text-text-secondary mb-6 max-w-md mx-auto">
								O teu pedido de promotor não foi aprovado. Podes tentar novamente
								com informações atualizadas.
							</p>
							<Button
								onClick={() => {
									setHasPendingRequest(false)
									setPendingStatus(null)
								}}
							>
								Tentar Novamente
							</Button>
						</div>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="max-w-3xl mx-auto space-y-8">
			{/* Hero */}
			<div className="stagger-1">
				<h1 className="font-display-alt font-700 text-3xl text-warm-text">
					Tornar-me Promotor
				</h1>
				<p className="text-text-secondary text-sm">
					Começa a vender bilhetes para os teus eventos
				</p>
			</div>

			{/* Benefits */}
			<div className="grid sm:grid-cols-3 gap-4 stagger-2">
				<div className="p-5 rounded-xl bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/10 text-center">
					<div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-brand flex items-center justify-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
					</div>
					<h3 className="font-heading font-600 text-sm text-warm-text mb-1">
						Cria Eventos
					</h3>
					<p className="text-xs text-text-secondary">
						Publica e gere os teus eventos com facilidade
					</p>
				</div>
				<div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-100 text-center">
					<div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-emerald-500 flex items-center justify-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
						</svg>
					</div>
					<h3 className="font-heading font-600 text-sm text-warm-text mb-1">
						Vende Bilhetes
					</h3>
					<p className="text-xs text-text-secondary">
						Recebe pagamentos por Multicaixa e PayPay
					</p>
				</div>
				<div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-100 text-center">
					<div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-amber-500 flex items-center justify-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
						</svg>
					</div>
					<h3 className="font-heading font-600 text-sm text-warm-text mb-1">
						Destaque-te
					</h3>
					<p className="text-xs text-text-secondary">
						Eventos em destaque para maior visibilidade
					</p>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit}>
				<div className="card-account stagger-3">
					<div className="p-6 sm:p-8">
						<h3 className="font-heading font-700 text-lg text-warm-text mb-6">
							Informação do Promotor
						</h3>
						<div className="space-y-5 max-w-lg">
							<Input
								label="Nome da Empresa *"
								placeholder="Ex: Produções Angolanas Lda"
								value={form.companyName}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, companyName: e.target.value }))
								}
								required
							/>

							{/* Tipo de Promotor */}
							<div>
								<label className="block text-sm font-heading font-600 text-warm-text mb-2">
									Tipo de Promotor *
								</label>
								<div className="grid grid-cols-2 gap-3">
									<button
										type="button"
										onClick={() =>
											setForm((prev) => ({
												...prev,
												promoterType: 'PESSOAL',
												nif: '',
											}))
										}
										disabled={uploading}
										className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.promoterType === 'PESSOAL' ? 'border-brand bg-brand/5' : 'border-warm-border bg-white hover:border-brand/50'}`}
									>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											className={
												form.promoterType === 'PESSOAL'
													? 'text-brand'
													: 'text-text-secondary'
											}
										>
											<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
										<span
											className={`text-sm font-heading font-600 ${form.promoterType === 'PESSOAL' ? 'text-brand' : 'text-warm-text'}`}
										>
											Pessoal
										</span>
										<span className="text-xs text-text-secondary">
											Promotor individual
										</span>
									</button>
									<button
										type="button"
										onClick={() =>
											setForm((prev) => ({
												...prev,
												promoterType: 'EMPRESARIAL',
											}))
										}
										disabled={uploading}
										className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.promoterType === 'EMPRESARIAL' ? 'border-brand bg-brand/5' : 'border-warm-border bg-white hover:border-brand/50'}`}
									>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											className={
												form.promoterType === 'EMPRESARIAL'
													? 'text-brand'
													: 'text-text-secondary'
											}
										>
											<rect
												x="2"
												y="7"
												width="20"
												height="14"
												rx="2"
												ry="2"
											/>
											<path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
										</svg>
										<span
											className={`text-sm font-heading font-600 ${form.promoterType === 'EMPRESARIAL' ? 'text-brand' : 'text-warm-text'}`}
										>
											Empresarial
										</span>
										<span className="text-xs text-text-secondary">
											Empresa constituída
										</span>
									</button>
								</div>
							</div>

							{/* NIF - only for enterprise */}
							{form.promoterType === 'EMPRESARIAL' && (
								<Input
									label="NIF (Número de Identificação Fiscal) *"
									placeholder="Ex: 5000123456"
									value={form.nif}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, nif: e.target.value }))
									}
									required
								/>
							)}

							<Input
								label="IBAN"
								placeholder="Ex: AO06012345678901234567890"
								value={form.iban}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, iban: e.target.value }))
								}
							/>

							{/* Documentos - conditional based on type */}
							{form.promoterType === 'PESSOAL' && (
								<div>
									<label className="block text-sm font-heading font-600 text-warm-text mb-2">
										Documentos Pessoais
									</label>
									<p className="text-xs text-text-secondary mb-3">
										BI, Passaporte ou outro documento de identificação
									</p>
									<input
										ref={personalInputRef}
										type="file"
										accept=".pdf,.png,.jpg,.jpeg"
										className="hidden"
										multiple
										onChange={(e) => {
											addFiles('personal', e.target.files)
											e.target.value = ''
										}}
									/>
									<div className="flex flex-wrap gap-2 mb-2">
										{personalFiles.map((file, i) => (
											<div
												key={`${file.name}-${file.size}`}
												className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-sm"
											>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													className="text-brand shrink-0"
												>
													<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
													<polyline points="14 2 14 8 20 8" />
												</svg>
												<span className="text-xs text-text-secondary truncate max-w-[120px]">
													{file.name}
												</span>
												<button
													type="button"
													onClick={() => removeFile('personal', i)}
													className="text-red-400 hover:text-red-600 transition-colors"
												>
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<line x1="18" y1="6" x2="6" y2="18" />
														<line x1="6" y1="6" x2="18" y2="18" />
													</svg>
												</button>
											</div>
										))}
									</div>
									<button
										type="button"
										onClick={() => personalInputRef.current?.click()}
										disabled={uploading}
										className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border-2 border-dashed border-warm-border text-sm text-text-secondary hover:border-brand hover:text-brand transition-all"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
										</svg>
										<span>Selecionar Ficheiros</span>
									</button>
								</div>
							)}

							{form.promoterType === 'EMPRESARIAL' && (
								<div>
									<label className="block text-sm font-heading font-600 text-warm-text mb-2">
										Documentos da Empresa
									</label>
									<p className="text-xs text-text-secondary mb-3">
										NIF, Alvará ou outro documento comercial
									</p>
									<input
										ref={enterpriseInputRef}
										type="file"
										accept=".pdf,.png,.jpg,.jpeg"
										className="hidden"
										multiple
										onChange={(e) => {
											addFiles('enterprise', e.target.files)
											e.target.value = ''
										}}
									/>
									<div className="flex flex-wrap gap-2 mb-2">
										{enterpriseFiles.map((file, i) => (
											<div
												key={`${file.name}-${file.size}`}
												className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-sm"
											>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													className="text-brand shrink-0"
												>
													<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
													<polyline points="14 2 14 8 20 8" />
												</svg>
												<span className="text-xs text-text-secondary truncate max-w-[120px]">
													{file.name}
												</span>
												<button
													type="button"
													onClick={() => removeFile('enterprise', i)}
													className="text-red-400 hover:text-red-600 transition-colors"
												>
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<line x1="18" y1="6" x2="6" y2="18" />
														<line x1="6" y1="6" x2="18" y2="18" />
													</svg>
												</button>
											</div>
										))}
									</div>
									<button
										type="button"
										onClick={() => enterpriseInputRef.current?.click()}
										disabled={uploading}
										className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border-2 border-dashed border-warm-border text-sm text-text-secondary hover:border-brand hover:text-brand transition-all"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
										</svg>
										<span>Selecionar Ficheiros</span>
									</button>
								</div>
							)}

							{/* Logo */}
							<div>
								<label className="block text-sm font-heading font-600 text-warm-text mb-2">
									Logotipo
								</label>
								<p className="text-xs text-text-secondary mb-3">
									Logótipo da empresa (recomendado: 500x500px, PNG ou JPG)
								</p>
								<input
									ref={logoInputRef}
									type="file"
									accept=".png,.jpg,.jpeg,.webp"
									className="hidden"
									onChange={(e) => {
										handleSingleFile(
											e.target.files?.[0] ?? null,
											setLogoFile,
											setLogoPreview,
										)
										e.target.value = ''
									}}
								/>
								{logoPreview ? (
									<div className="relative inline-block mb-2">
										<img
											src={logoPreview}
											alt="Logo preview"
											className="w-28 h-28 object-contain rounded-xl border border-warm-border bg-white"
										/>
										<button
											type="button"
											onClick={() => {
												setLogoFile(null)
												setLogoPreview(null)
											}}
											disabled={uploading}
											className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
										>
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
											>
												<line x1="18" y1="6" x2="6" y2="18" />
												<line x1="6" y1="6" x2="18" y2="18" />
											</svg>
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => logoInputRef.current?.click()}
										disabled={uploading}
										className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border-2 border-dashed border-warm-border text-sm text-text-secondary hover:border-brand hover:text-brand transition-all"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
										</svg>
										<span>Selecionar Logotipo</span>
									</button>
								)}
							</div>

							{/* Banner */}
							<div>
								<label className="block text-sm font-heading font-600 text-warm-text mb-2">
									Banner
								</label>
								<p className="text-xs text-text-secondary mb-3">
									Banner da empresa (recomendado: 1920x400px, PNG ou JPG)
								</p>
								<input
									ref={bannerInputRef}
									type="file"
									accept=".png,.jpg,.jpeg,.webp"
									className="hidden"
									onChange={(e) => {
										handleSingleFile(
											e.target.files?.[0] ?? null,
											setBannerFile,
											setBannerPreview,
										)
										e.target.value = ''
									}}
								/>
								{bannerPreview ? (
									<div className="relative mb-2">
										<img
											src={bannerPreview}
											alt="Banner preview"
											className="w-full h-28 object-cover rounded-xl border border-warm-border"
										/>
										<button
											type="button"
											onClick={() => {
												setBannerFile(null)
												setBannerPreview(null)
											}}
											disabled={uploading}
											className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
										>
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
											>
												<line x1="18" y1="6" x2="6" y2="18" />
												<line x1="6" y1="6" x2="18" y2="18" />
											</svg>
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => bannerInputRef.current?.click()}
										disabled={uploading}
										className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border-2 border-dashed border-warm-border text-sm text-text-secondary hover:border-brand hover:text-brand transition-all"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
										</svg>
										<span>Selecionar Banner</span>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 stagger-4 mt-6">
					<Button
						type="submit"
						loading={uploading || becomePromoter.isPending}
						disabled={uploading}
						className="h-12 px-8"
					>
						{uploading ? `A enviar documentos... ${uploadProgress}%` : 'Enviar Pedido'}
					</Button>
					<Button type="button" variant="ghost" onClick={() => navigate('/account')}>
						Cancelar
					</Button>
				</div>
			</form>
		</div>
	)
}
