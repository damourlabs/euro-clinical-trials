export const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
        'I': 'bg-blue-100 text-blue-800',
        'II': 'bg-green-100 text-green-800',
        'III': 'bg-yellow-100 text-yellow-800',
        'IV': 'bg-red-100 text-red-800'
    }
    return colors[phase] || 'bg-gray-100 text-gray-800'
}

export const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'Planning': 'bg-gray-100 text-gray-800',
        'Active': 'bg-green-100 text-green-800',
        'Paused': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-blue-100 text-blue-800',
        'Terminated': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
}

export const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}