<?php
$hostname     = "localhost";
$username     = "root";
$password     = "";
$databasename = "memoryapp";
// Create connection
$conn = mysqli_connect($hostname, $username, $password,$databasename);
// Check connection
if (!$conn) {
    die("Unable to Connect database: " . mysqli_connect_error());
}
$db=$conn;
// fetch query
function fetch_data(){
 global $db;
  $query="SELECT * from data ORDER BY id DESC";
 /*  select cast(Macolonne as integer) as num from matable
order by num asc
 */
  $exec=mysqli_query($db, $query);
  if(mysqli_num_rows($exec)>0){
    $row= mysqli_fetch_all($exec, MYSQLI_ASSOC);
    return $row;  
        
  }else{
    return $row=[];
  }
}
$fetchData= fetch_data();
show_data($fetchData);
function show_data($fetchData){

 echo '<table border="1">
        <tr>
            <th>SCORES</th>
        </tr>';
 if(count($fetchData)>0){
      $sn=1;
      foreach($fetchData as $data){ 
  echo "<tr>
          <td>".$data['score']."</td>
   </tr>";
       
  $sn++; 
     }
}else{
     
  echo "<tr>
        <td colspan='7'>No Data Found</td>
       </tr>"; 
}
  echo "</table>";
}

?>