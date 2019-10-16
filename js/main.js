var Do ={
	props:[ 'name' , 'isComplete' ,'index'],
	data(){
		return{

		}
	},
	
	template:`
	<div>
	<span><input type="checkbox" ref="checked" @change="$emit('change', [$event.target.checked, index])" v-bind:checked="isComplete"></span>
	<p v-if="!isComplete">{{name}}<p>
	<p v-if="isComplete"><del>{{name}}</del></p>
	</div>
	`
}
var Todo = {
	props:['id'],
	data(){
		return{
			todo:[],
			todolist:[],
			
			
		}
	},
	methods:{
		getList(){
			let id = this.$route.params.Id;

			
			axios.get('http://localhost:3000/ToDoList/'+id).then(response =>{
				this.todo = response.data.todo;
				this.todolist = response.data;
				
	  	});
		},
		changeValue(value){
			let id = this.$route.params.Id;
			let flag = value[0];
			let index = value[1];
			this.todo[index].completed = flag;
			this.todolist.todo = this.todo;
					
			axios.put('http://localhost:3000/ToDoList/'+id ,this.todolist).then(resp => {

				console.log(resp.data);
				}).catch(error => {
		
				console.log(error);
				});  
		}
	},
	components:{
		'do':Do
	},
	mounted(){
		this.getList();
	},
	template:`
	<ul id="to-do-sub-list">
		<li  v-for="(todo,index) in todo" v-bind:id="id" >
			<do v-bind:name="todo.name" v-bind:isComplete="todo.completed" v-bind:index="index" @change="changeValue"></do>
		</li>
	</ul>
	`
}

var TodoHeader = {

	data(){
		return{
		}
	}
	,
	template:`
	  <h1>To-do list</h1>
	`
}

var AddTodo = {

	data(){
		return{
		}
	},
	template:`
		<form id="add-list-item-form">
      <input id="list-input" name="field" maxlength="100" type="text" autocomplete="on"></input>
      <button type="submit" id="submit-list-item" href="#">+</button> 
    </form>
	`
}
var  TodoLists = {

	data(){
    return{
      todolist:[]
    }
  },
  components:{
	  	  'TodoHeader':TodoHeader,
		   'AddToDo':AddTodo
	},
	mounted(){
		this.getData();
	},
	methods:{
		getData(){
			axios.get('http://localhost:3000/ToDoList').then(response =>{
				this.todolist = response.data;
				for(todo in this.todolist){
					console.log(this.todolist[todo].id);
				}
				
	  });
		},
		passId(id){
			sessionStorage.setItem('Id', id);
			window.location.href="index.html#/todo";
		}
	},
	//<todo  v-bind:id="todo.id" v-on:click="!show"></todo>
	components:{
		'todo':Todo
	},
	template:`
	  
		<ul id="to-do-list">
			 <li  v-for="todo in todolist">
			 <router-link :to="{name:'todo' ,  params: { Id: todo.id }}" style="text-decoration:none;color:white;">
			 			 {{todo.id}} . {{ todo.title}}
			 </router-link>
			 </li>
  	</ul>
  
	`
}


var router = new VueRouter({
	routes:[
		{path:'/', component:TodoLists },
		{name:'todo' , path:'/todo/:Id',component:Todo}
	]
});




var myObject = new Vue({
	router,
  el: '#app',
  
  components: {
	 
		'todolists': TodoLists,
		'addtodo':AddTodo,
		'todoheader':TodoHeader,
		'todo':Todo
  
  }
});