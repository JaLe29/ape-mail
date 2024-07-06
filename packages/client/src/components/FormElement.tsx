import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 1em;

	.label {
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
	}
`;

interface Props {
	children: React.ReactNode;
	label: string;
}

export const FormElement: React.FC<Props> = ({ children, label }) => (
	<Wrapper>
		<label className="label">{label}</label>
		{children}
	</Wrapper>
);
