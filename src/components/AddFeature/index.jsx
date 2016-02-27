import React from 'react'
import request from 'superagent'
import TextInput from '../FormComponents/TextInput'
import Select from '../FormComponents/Select'
import TextArea from '../FormComponents/TextArea'
import SubmitButton from '../FormComponents/SubmitButton'
import clients from '../../data/clients'
import products from '../../data/products'
import featureRequests from '../../data/feature-requests'
import styles from './styles.css'
import qMarkIcon from '../../images/help-circle.png'


export default class AddFeature extends React.Component {
  constructor() {
    super()
    
    this.state = { 
      clients: [], 
      products: [],
      priorities: [],
      requestSubmission: {
        clientId: '',
        title: '',
        description: '',
        priority: 0,
        targetDate: '',
        ticketUrl: '',
        productId: ''
      },
      priorityIsDisabled: true,
      priorityPlaceHolder: 'First Select a Client'
    }
    
    this.loadClients = this.loadClients.bind(this)
    this.loadProducts = this.loadProducts.bind(this)
    this.loadPriorities = this.loadPriorities.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleClientSelect = this.handleClientSelect.bind(this)
    this.handlePrioritySelect = this.handlePrioritySelect.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleProductSelect = this.handleProductSelect.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
  
  handleTitleChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.title = value
    
    this.setState({requestSubmission: requestObject})
  }
  
  handleClientSelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.clientId = event.target.value
    requestObject.priority = 0

    // reset the priority select box
    this.refs.priority.refs.selectElement.selectedIndex = 0
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
  
  handleDateChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.targetDate = value
    
    this.setState({requestSubmission: requestObject})
  }
  
   handleUrlChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.ticketUrl = value
  
    this.setState({requestSubmission: requestObject})
  }
  
  handleProductSelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.productId = event.target.value
  
    this.setState({requestSubmission: requestObject})
  }
  
  handleDescriptionChange(value) {    
    let requestObject = this.state.requestSubmission

    requestObject.description = value
  
    this.setState({requestSubmission: requestObject})
  }
  
  handleSubmit(event) {
    event.preventDefault()
    console.log('Clicked Submit')
  }
  
  componentDidMount() {
    this.loadClients()
    this.loadProducts()
  }
  
  render() {   
    return (
      <section>
        <form className={styles.addFeatureForm}onSubmit={this.handleSubmit}>
          <TextInput
            type="text"
            id="title"
            label="Title"
            placeHolder="A Short Descriptive Title"
            value={this.state.requestSubmission.title}
            onChange={this.handleTitleChange}
          />
          
          <Select
            id="client"
            label="Client"            
            icon={qMarkIcon}
            placeHolder="Select a Client"
            disabledPlaceHolder={true}
            options={this.state.clients}
            optionValue="name"
            optionKey="id"
            onChange={this.handleClientSelect}
          />
          
          <Select
            ref="priority"
            id="priority"
            label="Priority"
            icon={qMarkIcon}
            placeHolder={this.state.priorityPlaceHolder}
            disabled={this.state.priorityIsDisabled}
            options={this.state.priorities}
            onChange={this.handlePrioritySelect}
          />
          
          <TextInput
            type="date"
            id="date"
            label="Target Date"
            onChange={this.handleDateChange}
          />
          
          <TextInput
            type="url"
            id="url"
            label="Ticket URL"
            onChange={this.handleUrlChange}
          />
          
          <Select
            id="product"
            label="Product Area"
            icon={qMarkIcon}
            options={this.state.products}
            optionValue="name"
            optionKey="id"
            onChange={this.handleProductSelect}
          />
          
          <TextArea
            id="description"
            label="Description"
            placeHolder="A description of the feature request."
            value={this.state.requestSubmission.description}
            onChange={this.handleDescriptionChange}
          />
          
          <SubmitButton
            buttonText="Submit Feature Request"
          />
        </form>
      </section>
    )
  }
}
