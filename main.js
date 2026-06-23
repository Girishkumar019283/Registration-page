(function(){
  const form = document.getElementById('regForm');
  const msg = document.getElementById('message');
  const dobInput = document.getElementById('dob');

  function show(text){ msg.textContent = text; msg.style.display = 'block'; }
  function clearAfter(ms){ setTimeout(()=>{ msg.style.display='none'; msg.textContent=''; }, ms||3000); }

  if (dobInput) {
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const dob = dobInput.value;
    const city = document.getElementById('city').value.trim();

    document.getElementById('pin').addEventListener('input', function (e) {
  // Removes any character that is not a number
  this.value = this.value.replace(/[^0-9]/g, '');
  
  // Cuts off any numbers beyond 6 digits
  if (this.value.length > 6) {
    this.value = this.value.slice(0, 6);
  }
});


    if(!name) return show('Please enter your name');
    if(!dob) return show('Please select your date of birth');

    const selectedDate = new Date(dob);
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);

    if(selectedDate > todayDate) return show('Date of birth cannot be in the future');
    if(!city) return show('Please enter your city');

    show('Registration submitted — ' + name + ' • ' + dob + ' • ' + city);
    clearAfter(4000);
  });
})();
