export default function Button({onClick}) {
    return(
        <button className="button bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
        onClick={onClick}
      >
        Run Code
        </button>
    )
}