import { getHealth } from '../api/healthApi.js'

export async function checkHealth() {
    const response = await getHealth()
    return response.data
}
