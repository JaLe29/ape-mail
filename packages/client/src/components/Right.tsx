import styled from 'styled-components';

const StyledDiv = styled.div`
	display: flex;
	flex-direction: row-reverse;
`;

interface Props {
	children: React.ReactNode;
}

export const Right: React.FC<Props> = ({ children }) => <StyledDiv>{children}</StyledDiv>;
