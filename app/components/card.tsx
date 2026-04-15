'use client'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({product}: any) {
  return (
    <Card sx={{ maxWidth: 345 , margin: '10px'}}>
      <CardActionArea onClick={()=>alert('Card clicked!')}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
      {console.log(product.nom)}
            {product.nom}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}