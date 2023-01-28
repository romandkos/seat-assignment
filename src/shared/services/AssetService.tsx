import axios from 'axios'
import { PROXY_URL } from '../constants'
import { IDeskAssignment } from './UserService'

export interface IAsset {
    id: string
}

export interface IAssetService {
    assignUser: Function,
    removeUser: Function,
    fetchFloorAssets: Function,
    fetchAssetsCustomField: Function
}

export const assignedToPath = 'properties.customFields.assignedTo'

const resourceType = 'asset'

const assignUser = (deskAssignment: IDeskAssignment) => {
    return {}
}

const removeUser = (assetId: string) => {
    return {}
}

const fetchFloorAssets = (floorId: string) => {
    return {}
}

const fetchAssetsCustomField = (assetsId: string[]) => {
    const allRequests = assetsId.map(id => axios.get(`${PROXY_URL}/v2/${resourceType}/${id}/custom-field`))

    return axios.all(allRequests)
}

const AssetService: IAssetService = {
    assignUser: assignUser,
    removeUser: removeUser,
    fetchFloorAssets: fetchFloorAssets,
    fetchAssetsCustomField: fetchAssetsCustomField
}

export default AssetService