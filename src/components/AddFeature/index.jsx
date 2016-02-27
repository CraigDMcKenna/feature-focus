import React from 'react'
import request from 'superagent'
import TextInput from '../FormComponents/TextInput'
import Select from '../FormComponents/Select'
import TextArea from '../FormComponents/TextArea'
import clients from '../../data/clients'
import products from '../../data/products'
import featureRequests from '../../data/feature-requests'
import styles from './styles.css'
import qMarkIcon from '../../images/help-circle.png'


export default class AddFeature extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = { 
      clients: [], 
      products: [],
      priorities: [],
      requestSubmission: {
        clientId: '',
        title: '',
        description: '',
        priority: 0,
        targetDate: 0,
        ticketUrl: '',
        productId: ''
      },
      priorityIsDisabled: true,
      priorityPlaceHolder: 'First Select a Client'
    }
    
    this.loadClients = this.loadClients.bind(this)
    this.loadProducts = this.loadProducts.bind(this)
    this.loadPriorities = this.loadPriorities.bind(this)
    this.handleClientSelect = this.handleClientSelect.bind(this)
    this.handlePrioritySelect = this.handlePrioritySelect.bind(this)
  }
  
  loadClients() {
    clients.getClients((response) => {
      this.setState({clients: response})
    })
  }
  
  loadProducts() {
    products.getProducts((response) => {
      this.setState({products: response})
    })
  }
  
  loadPriorities(clientId) {
    featureRequests.getRequests(clientId, (response) => {
      let values = []
          
      if (response.length >= 1) {
        for (let i = 0; i <= response.length; i++) {
          values.push( i + 1 )
        }
      } else {
        values.push(1)
      }
      
      this.setState({priorities: values})
    })
  }
  
  handleClientSelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.clientId = event.target.value
    requestObject.priority = 0

    this.setState({requestSubmission: requestObject})
    this.loadPriorities(event.target.value)
    this.setState({priorityIsDisabled: false})
    this.setState({priorityPlaceHolder: 'Priority According to Client'})
  }
  
  handlePrioritySelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.priority = event.target.value
    
    this.setState({requestSubmission: requestObject})
  }
  
  componentDidMount() {
    this.loadClients()
    this.loadProducts()
  }
  
  render() {   
    return (
      <section className={styles.addFeature}>
        <form>
          <TextInput
            type="text"
            label="Title"
            id="title"
            placeHolder="A Short Descriptive Title"
          />
          
          <TextArea 
            label="Description"
            id="description"
            placeHolder="A description of the feature request."
          />
          
          <Select
            label="Client"
            id="client"
            icon={qMarkIcon}
            placeHolder="Select a Client"
            disabledPlaceHolder={true}
            options={this.state.clients}
            optionValue="name"
            optionKey="id"
            onChange={this.handleClientSelect}
          />
          
          <Select
            label="Priority"
            id="priority"
            icon={qMarkIcon}
            placeHolder={this.state.priorityPlaceHolder}
            disabled={this.state.priorityIsDisabled}
            options={this.state.priorities}
            onChange={this.handlePrioritySelect}
          />
          
          <TextInput 
            type="date"
            label="Target Date"
            id="date"
          />
          
          <TextInput
            type="url"
            label="Ticket URL"
            id="url"
          />
          
          <Select
            label="Product Area"
            id="product"
            icon={qMarkIcon}
            options={this.state.products}
            optionValue="name"
            optionKey="id"
          />
        </form>
      </section>
    )
  }
}
