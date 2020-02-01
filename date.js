exports.getDate=function()
{

  options={
    weekday:"long",
    month:"long",
    day:"numeric"
  }
    var today = new Date();
    var dayName=today.toLocaleDateString("en-US",options);
    return dayName;
}
