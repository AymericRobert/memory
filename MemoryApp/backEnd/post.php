<?php
$conn = new mysqli('localhost', 'root', '', 'memoryapp');
$name=$_POST['name'];
$score=$_POST['score'];
$sql="INSERT INTO `data` (`id`, `name`, `score`) VALUES (NULL, '$name', '$score')";
if ($conn->query($sql) === TRUE) {
    echo "score sauvegard√©";
}
else 
{
    echo "failed";
}
?>