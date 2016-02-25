import React from 'react'
import TextInput from '../FormComponents/TextInput'
import Select from '../FormComponents/Select'
import TextArea from '../FormComponents/TextArea'
import styles from './styles.css'

const Clients = [
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
  { id: 3, name: 'Client C' }
]

// will need to be dynamic (by customer when customer selected)
const Priorities = [1,2,3,4,5,6,7,8,9,10]

const Products = [
  { id: 1, name: 'Policies' },
  { id: 2, name: 'Billing' },
  { id: 3, name: 'Claims' },
  { id: 4, name: 'Reports' }
]

export default class AddFeature extends React.Component {
  render() {
    let clientOptions = Clients.map(client =>{
      return (
        <option key={client.id} value={client.name}>{client.name}</option>
      )
    })
    
    let priorityOptions = Priorities.map(priority =>{
      return (
        <option key={priority} value={priority}>{priority}</option>
      )
    })
    
    let productOptions = Products.map(product =>{
      return (
        <option key={product.id} value={product.name}>{product.name}</option>
      )
    })
    
    return (
      <form className={styles.addFeature}>
        <TextInput
          type="text"
          label="Title"
          id="title"
          defaultValue="Name of Request"
        />
        
        <TextArea 
          label="Description"
          id="description"
        />
        
        <Select
          label="Client"
          id="client"
          options={clientOptions}
        />
        
        <Select
          label="Priority"
          id="priority"
          options={priorityOptions}
        />
        
        <TextInput 
          type="date"
          label="Target Date"
          id="date"
          defaultValue=""
        />
        
        <TextInput
          type="url"
          label="Ticket URL"
          id="url"
          defaultValue=""
        />
        
        <Select
          label="Product Area"
          id="product"
          options={productOptions}
        />
      </form>
    )
  }
}
