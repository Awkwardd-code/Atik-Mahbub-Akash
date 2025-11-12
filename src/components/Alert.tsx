type AlertType = 'danger' | 'success';

type AlertProps = {
  text: string;
  type?: AlertType;
  show?: boolean;
};

const Alert = ({ type = 'danger', text }: AlertProps) => {
  const badgeColor = type === 'danger' ? 'bg-red-500' : 'bg-blue-500';
  const containerColor = type === 'danger' ? 'bg-red-800' : 'bg-blue-800';
  const label = type === 'danger' ? 'Failed' : 'Success';

  return (
    <div className="fixed bottom-5 right-5 flex justify-center items-center z-50">
      <div
        className={`p-2 ${containerColor} items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex rounded-md p-5`}
        role="alert">
        <p className={`flex rounded-full ${badgeColor} uppercase px-2 py-1 text-xs font-semibold mr-3`}>{label}</p>
        <p className="mr-2 text-left">{text}</p>
      </div>
    </div>
  );
};

export type { AlertProps, AlertType };
export default Alert;
