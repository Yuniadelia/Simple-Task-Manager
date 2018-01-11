<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel">
                    <div class="panel-heading largerFont">
                        <button @click="initAddTask()" class="btn btn-primary btn-xs pull-right">
                            <span class="glyphicon glyphicon-plus"></span> Add New Task
                        </button>
                        My Tasks
                    </div>

                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        <div v-for="(task,index) in orderedTasks" class="panel">
                            <div class="panel-heading mint" role="tab" :id="'heading'+index" data-toggle="collapse" data-parent="#accordion" :href="'#collapse'+index" aria-expanded="false" aria-controls="'collapse'+index">
                                <h4 class="panel-title">
                                    <a role="button">
                                        {{task.name}}
                                    </a>
                                    <span class="done-badge" v-if="task.status==1">DONE</span>
                                    <span class="right">{{task.due_date |moment("from","now")}}</span>
                                </h4>
                            </div>
                            <div :id="'collapse'+index" class="panel-collapse collapse" role="tabpanel" aria-labelledby="'heading'+index">
                                <div class="panel-body border-darkMint">
                                    <p class="bold">Description :</p>
                                    <p>{{task.description}}</p>
                                    <p class="bold">Due Date :</p>
                                    <p>{{task.due_date |moment("dddd, MMMM Do YYYY")}}</p>
                                    <button v-if="task.status==0" @click="initUpdate(index)" class="btn btn-warning btn-xs"><span class="glyphicon glyphicon-edit"></span> Edit</button>
                                    <button @click="deleteTask(index)" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-trash"></span> Delete</button>
                                    <button v-if="task.status==0" type="button" @click="doneTask(index)" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span> Done</button>
                                </div>
                            </div>
                        </div>
                    <div>
                </div>
            </div>
        </div>

        <div class="modal fade" tabindex="-1" role="dialog" id="add_task_model">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header darkMint textWhite">
                        <button type="button" class="close textWhite" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Add New Task</h4>
                    </div>
                    <div class="modal-body">

                        <div class="alert alert-danger" v-if="errors.length > 0">
                            <ul>
                                <li v-for="error in errors">{{ error }}</li>
                            </ul>
                        </div>

                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" name="name" id="name" placeholder="Task Name" class="form-control"
                                   v-model="task.name">
                        </div>
                        <div class="form-group">
                            <label for="description">Description:</label>
                            <textarea name="description" id="description" cols="30" rows="5" class="form-control"
                                      placeholder="Task Description" v-model="task.description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="date">Due Date:</label>
                            <input type="date" name="date" id="date" placeholder="Task Due Date" class="form-control"
                                   v-model="task.due_date">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" @click="createTask" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" tabindex="-1" role="dialog" id="update_task_model">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header darkMint textWhite">
                        <button type="button" class="close textWhite" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Update Task</h4>
                    </div>
                    <div class="modal-body">

                        <div class="alert alert-danger" v-if="errors.length > 0">
                            <ul>
                                <li v-for="error in errors">{{ error }}</li>
                            </ul>
                        </div>

                        <div class="form-group">
                            <label>Name:</label>
                            <input type="text" placeholder="Task Name" class="form-control"
                                   v-model="update_task.name">
                        </div>
                        <div class="form-group">
                            <label for="description">Description:</label>
                            <textarea cols="30" rows="5" class="form-control"
                                      placeholder="Task Description" v-model="update_task.description"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Due Date:</label>
                            <input type="date" placeholder="Task Due Date" class="form-control"
                                   v-model="update_task.due_date">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" @click="updateTask" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
        </div></div>
</template>

<script>
    export default {
        data(){
            return {
                task: {
                    name: '',
                    description: '',
                    due_date: '',
                    status: ''
                },
                errors: [],
                tasks: [],
                update_task: {}
            }
        },
        mounted()
        {
            this.readTasks();
        },
        methods: {
            initAddTask()
            {
                $("#add_task_model").modal("show");
            },
            createTask()
            {
                axios.post('/task', {
                    name: this.task.name,
                    description: this.task.description,
                    due_date: this.task.due_date,
                    status: 0
                })
                    .then(response => {
                        this.reset();

                        this.readTasks();

                        $("#add_task_model").modal("hide");

                    })
                    .catch(error => {
                        this.errors = [];
                        if (error.response.data.errors.name) {
                            this.errors.push(error.response.data.errors.name[0]);
                        }

                        if (error.response.data.errors.description) {
                            this.errors.push(error.response.data.errors.description[0]);
                        }

                        if (error.response.data.errors.due_date) {
                            this.errors.push(error.response.data.errors.due_date[0]);
                        }
                    });
            },
            reset()
            {
                this.task.name = '';
                this.task.description = '';
                this.task.due_date = '';
                this.task.status = ''
            },
            readTasks()
            {
                axios.get('/task')
                    .then(response => {

                        this.tasks = response.data.tasks;

                    });
            },
            initUpdate(index)
            {
                this.errors = [];
                $("#update_task_model").modal("show");
                this.update_task = this.orderedTasks[index];
            },
            updateTask()
            {
                axios.patch('/task/' + this.update_task.id, {
                    name: this.update_task.name,
                    description: this.update_task.description,
                    due_date: this.update_task.due_date
                })
                    .then(response => {

                        $("#update_task_model").modal("hide");

                    })
                    .catch(error => {
                        this.errors = [];
                        if (error.response.data.errors.name) {
                            this.errors.push(error.response.data.errors.name[0]);
                        }

                        if (error.response.data.errors.description) {
                            this.errors.push(error.response.data.errors.description[0]);
                        }
                    });
            },
            deleteTask(index)
            {
                let conf = confirm("Do you ready want to delete this task?");
                if (conf === true) {

                    axios.delete('/task/' + this.orderedTasks[index].id)
                        .then(response => {
                            this.tasks.splice(index, 1);

                        })
                        .catch(error => {

                        });
                }
            },
            doneTask(index){
                axios.put('/done/' + this.orderedTasks[index].id , {
                    status: 1
                })
                    .then(response => {
                        this.reset();

                        this.readTasks();

                    })
                    .catch(error => {
                        this.errors = [];
                        if (error.response.data.errors.name) {
                            this.errors.push(error.response.data.errors.name[0]);
                        }

                        if (error.response.data.errors.description) {
                            this.errors.push(error.response.data.errors.description[0]);
                        }
                    });
            }
        },
        computed: {
            orderedTasks: function () {
                return _.orderBy(this.tasks, 'due_date')
            }
        }
    }
</script>