type NavigateFn = (to: string, options?: { replace?: boolean; state?: unknown }) => void

let navigateFn: NavigateFn | null = null

export const setNavigate = (fn: NavigateFn) => {
	navigateFn = fn
}

export const navigate = (to: string, options?: { replace?: boolean; state?: unknown }) => {
	if (navigateFn) {
		navigateFn(to, options)
	} else {
		window.location.href = to
	}
}
