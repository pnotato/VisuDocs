import './Button.css'

export default function Button({onClick, Label, Icon}) {
    return(
        <button className="button bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
        onClick={onClick}
      >
        {Icon ? Icon : Label}
        </button>
    )
}