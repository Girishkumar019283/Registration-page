(function(){
  const form = document.getElementById('regForm');
  const msg = document.getElementById('message');
  function show(text){ msg.textContent = text; msg.style.display = 'block' }
  function clearAfter(ms){ setTimeout(()=>{ msg.style.display='none'; msg.textContent=''; }, ms||3000) }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value;
    const city = document.getElementById('city').value.trim();
    if(!name) return show('Please enter your name');
    if(!dob) return show('Please select your date of birth');
    if(!city) return show('Please enter your city');
    show('Registration submitted — ' + name + ' • ' + dob + ' • ' + city);
    clearAfter(4000);
  });
})();
