<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        My Profile
                    </div>

                    <div class="panel-body">
                        <p>{{profile.name}}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                profile: {
                    name: '',
                    email: '' 
                },
                errors: []
            }
        },
        mounted()
        {
            this.getProfile();
        },
        methods: {
            getProfile()
            {
                axios.get('/profile')
                    .then(response => {
                        this.profile = response.data.profile;
                        console.log(response);
                    });
            },
        }
    }
</script>