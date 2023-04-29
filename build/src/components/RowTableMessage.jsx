import React from 'react'

const RowTableMessage = ({colSpan, message}) => {
	return (
		<tr>
			<td className="py-4 px-6 text-center font-medium w-max" colSpan={colSpan}>{message}</td>
		</tr>
	)
}

export default RowTableMessage