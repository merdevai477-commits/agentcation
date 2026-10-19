import { shadcn } from '@clerk/ui/themes'

const glassField =
  'bg-white/[0.04] border border-white/10 text-slate-100 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/25'

export const clerkAppearance = {
  theme: shadcn,
  variables: {
    colorPrimary: '#8b5cf6',
    colorDanger: '#f43f5e',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorNeutral: '#e2e8f0',
    colorTextOnPrimaryBackground: '#ffffff',
    colorText: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorBackground: 'rgba(10, 14, 28, 0.35)',
    colorInputBackground: 'rgba(255,255,255,0.04)',
    colorInputText: '#f8fafc',
    colorBorder: 'rgba(255,255,255,0.12)',
    borderRadius: '0.9rem',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
    fontSize: '0.95rem',
  },
  options: {
    socialButtonsVariant: 'iconButton' as const,
    socialButtonsPlacement: 'top' as const,
  },
  layout: {
    socialButtonsVariant: 'iconButton' as const,
  },
  elements: {
    rootBox: 'w-full mx-auto',
    cardBox: 'w-full shadow-none bg-transparent',
    card: 'bg-transparent! shadow-none! border-0!',
    main: 'gap-5',
    header: 'text-center gap-2',
    headerTitle: 'text-[1.25rem] font-semibold tracking-tight text-white',
    headerSubtitle: 'text-slate-400 text-sm leading-relaxed',
    logoBox: 'hidden!',
    logoImage: 'hidden!',
    socialButtons: 'gap-3',
    socialButtonsIconButton: [
      'h-11 w-11 rounded-xl',
      'bg-white/[0.05] border border-white/12',
      'hover:bg-white/[0.1] hover:border-violet-300/35',
      'transition duration-200',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    ].join(' '),
    dividerLine: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
    dividerText: 'text-slate-500 text-xs uppercase tracking-[0.2em]',
    formFieldLabel: 'text-slate-300 text-xs font-medium tracking-wide',
    formFieldInput: [
      'h-11 rounded-xl',
      glassField,
    ].join(' '),
    formButtonPrimary: [
      'h-11 rounded-xl font-semibold tracking-wide',
      'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400',
      'hover:brightness-110',
      'shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_40px_rgba(139,92,246,0.35)]',
      'transition duration-200',
    ].join(' '),
    footer: 'bg-transparent!',
    footerAction: 'text-slate-400',
    footerActionLink: 'text-violet-300 hover:text-cyan-300 font-medium',
    identityPreview: 'bg-white/[0.04] border border-white/10 rounded-xl',
    formFieldAction: 'text-violet-300 hover:text-cyan-300',
    alternativeMethodsBlockButton: [
      'bg-white/[0.04] border border-white/10 rounded-xl',
      'hover:bg-white/[0.08]',
    ].join(' '),
    otpCodeFieldInput: glassField + ' rounded-xl',
    alertText: 'text-slate-300',
  },
}
