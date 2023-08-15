package com.example.helloworld

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Greeting("World")
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Column{
        Text(
            text = "Hello $name!",
            modifier = modifier,
            style = TextStyle(
                color = Color(70, 80, 255),
                fontSize = TextUnit(20F, TextUnitType.Em),
            ),
        )
        Text(text = "\n\tSecond Line using Column");
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting("World");
}
