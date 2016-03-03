// TODO: Refactor onChange event handlers-
//       Maybe migrate to ES7 Property Initializers?
//       * Compact onChange into one/few method(s)

import React from 'react'
import Modal from '../Modal'
import TextInput from '../FormComponents/TextInput'
import Select from '../FormComponents/Select'
import TextArea from '../FormComponents/TextArea'
import SubmitButton from '../FormComponents/SubmitButton'
import clients from '../../data/clients'
import products from '../../data/products'
import featureRequests from '../../data/feature-requests'
import styles from './styles.css'

export default class AddFeature extends React.Component {
  constructor() {
    super()

    this.state = {
      clientsLoading: true,
      prioritiesLoading: false,
      productsLoading: true,
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
        productId: '',
        createdBy: localStorage.user_id,
        owner: localStorage.user_id
      },
      submissionReady: false,
      submitDisabled: true,
      priorityIsDisabled: true,
      priorityPlaceHolder: 'First Select a Client'
    }

    this.loadClients = this.loadClients.bind(this)
    this.loadProducts = this.loadProducts.bind(this)
    this.loadPriorities = this.loadPriorities.bind(this)
    this.validate = this.validate.bind(this)
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
      this.setState({clientsLoading: false})
    })
  }

  loadProducts() {
    products.getProducts((response) => {
      this.setState({products: response})
      this.setState({productsLoading: false})
    })
  }

  loadPriorities(clientId) {
    this.setState({prioritiesLoading: true})

    featureRequests.getRequestsByClient(clientId, (response) => {
      let values = []

      if (response.length >= 1) {
        for (let i = 0; i <= response.length; i++) {
          values.push( i + 1 )
        }
      } else {
        values.push(1)
      }

      this.setState({priorities: values})
      this.setState({prioritiesLoading: false})
    })
  }

  validate() {
    // primitive, needs much more validation
    let request = this.state.requestSubmission
    let completeFieldsCount = 0;

    for (var prop in request) {
      if (request[prop]) {
        completeFieldsCount ++
      }
    }

    if (completeFieldsCount === 9) {
      this.setState({submissionReady: true})
      this.setState({submitDisabled: false})
    } else {
      this.setState({submissionReady: false})
      this.setState({submitDisabled: true})
    }
  }

  handleTitleChange(value, event) {
    let requestObject = this.state.requestSubmission

    requestObject.title = value

    this.setState({requestSubmission: requestObject})
    this.validate()
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
    this.validate()
  }

  handlePrioritySelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.priority = event.target.value

    this.setState({requestSubmission: requestObject})
    this.validate()
  }

  handleDateChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.targetDate = value

    this.setState({requestSubmission: requestObject})
    this.validate()
  }

   handleUrlChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.ticketUrl = value

    this.setState({requestSubmission: requestObject})
    this.validate()
  }

  handleProductSelect(event) {
    let requestObject = this.state.requestSubmission

    requestObject.productId = event.target.value

    this.setState({requestSubmission: requestObject})
    this.validate()
  }

  handleDescriptionChange(value) {
    let requestObject = this.state.requestSubmission

    requestObject.description = value

    this.setState({requestSubmission: requestObject})
    this.validate()
  }

  handleSubmit(event) {
    event.preventDefault()

    let submission = this.state.requestSubmission

    featureRequests.createRequest(submission, (response) => {
      alert('Request Added: ' + JSON.stringify(response))
    })

    this.refs.form.reset()
    this.setState({priorityIsDisabled: true})
    this.setState({submitDisabled: true})

  }

  componentDidMount() {
    this.loadClients()
    this.loadProducts()
  }

  render() {
    return (
      <section>
        <h1 className={styles.pageTitle}>Add a New Feature Request</h1>
        <form
          ref="form"
          className={styles.addFeatureForm}
          onSubmit={this.handleSubmit}
        >
          <TextInput
            type="text"
            id="title"
            label="Title"
            placeHolder="A Short Descriptive Title"
            value={this.state.requestSubmission.title}
            onChange={this.handleTitleChange}
          />

          <Select
            loading={this.state.clientsLoading}
            id="client"
            label="Client"
            placeHolder="Select a Client"
            disabledPlaceHolder={true}
            options={this.state.clients}
            optionValue="name"
            optionKey="id"
            onChange={this.handleClientSelect}
          />

          <Select
            loading={this.props.prioritiesLoading}
            ref="priority"
            id="priority"
            label="Priority"
            placeHolder={this.state.priorityPlaceHolder}
            disabledPlaceHolder={true}
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
            placeHolder="https://example.com"
            onChange={this.handleUrlChange}
          />

          <Select
            loading={this.state.productsLoading}
            id="product"
            label="Product Area"
            placeHolder="Select a Product"
            disabledPlaceHolder={true}
            options={this.state.products}
            optionValue="productName"
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
            disabled={this.state.submitDisabled}
          />
        </form>
      </section>
    )
  }
}
