exports.bodyemail= (dados)=>{
    htmlbody= '<h1>Ola´{name}</h1>'
    htmlbody+= '<h1>Ola´{token}</h1>'


    htmlbody= htmlbody.replace('{name}',dados.name)
    htmlbody= htmlbody.replace('{token}',dados.token)

    return htmlbody;
}