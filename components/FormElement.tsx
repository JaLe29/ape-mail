import css from '@/styles/FormElement.module.css';

interface Props {
	children: React.ReactNode;
	label: string;
}

export const FormElement: React.FC<Props> = ({ children, label }) => {
	return (
		<div className={css.root}>
			<label className={css.label}>{label}</label>
			{children}
		</div>
	);
};
