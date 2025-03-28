const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    // Size variants
    const sizes = {
        small: {
            spinner: 'h-4 w-4',
            text: 'text-sm',
        },
        medium: {
            spinner: 'h-8 w-8',
            text: 'text-base',
        },
        large: {
            spinner: 'h-12 w-12',
            text: 'text-lg',
        },
    };

    const sizeClass = sizes[size] || sizes.medium;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <svg
                className={`animate-spin ${sizeClass.spinner} text-primary-600 dark:text-primary-400`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            {text && <p className={`mt-2 text-gray-600 dark:text-gray-400 ${sizeClass.text}`}>{text}</p>}
        </div>
    );
};

export default LoadingSpinner;