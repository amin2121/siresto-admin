import './LoadingTable.css'

const LoadingTable = ({colSpan}) => {

	return (
		<tr className="bg-white border-b border-blue-200">
			<td colSpan={colSpan} className="text-center py-6 px-6">
				<div className="spinner-container space-y-4">
				  	<div className="spinner">
				  	</div>
				  	<div className="text-xs">Loading...</div>
				</div>
			</td>
		</tr>
	)

}

export default LoadingTable