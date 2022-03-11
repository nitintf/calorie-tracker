import {css} from '@emotion/react'

export const global = css`
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: 'border-box';
	}
	body {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		font-family: 'Montserrat';
	}
`
