var usuarios = [
    {user:'yerko',cuenta:1234,nombre:'juvenal yerko',ap:'barriga solano',correo:'yerko@gmail.com',saldo:5840},
    {user:'juan',cuenta:12345,nombre:'luis miguel',ap:'Ibarra',correo:'luis@gmail.com',saldo:5500},
    {user:'ulises',cuenta:123456,nombre:'cristiano ronaldo',ap:'Castillo',correo:'cristiano@gmail.com',saldo:7800}
];
function verficarCredencial(){
    let userInput    =  document.getElementById('usuario').value;
    let contraInput  =  document.getElementById('contrasena').value;
    let resultSearch =  usuarios.find(function(parametro){
        return parametro.user === userInput && parametro.cuenta === parseInt(contraInput);

    });
    if(resultSearch){
        Swal.fire({
            icon: 'success',
            title: '¡Perfecto!',
            showConfirmButton: false,
            timer: 1200
        }).then(() => {
           //nos envia a la siguente pagina con valores es un query string
        window.location.href = `admin.html?user=${resultSearch.user}&cuenta=${resultSearch.cuenta}&nombre=${resultSearch.nombre}&ap=${resultSearch.ap}&correo=${resultSearch.correo}&saldo=${resultSearch.saldo}`;
          });
        
    }else{
        Swal.fire({
            icon: 'error',
            title: '¡Incorrecto!',
            text: 'Usuario o contraseña incorrectos',
            showConfirmButton: false,
            timer: 3000
        });
    }   
}

