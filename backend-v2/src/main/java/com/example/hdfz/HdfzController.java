package com.example.hdfz;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
public class HdfzController {

	@GetMapping("/api/details")
	public Details details() {
        Map<String, String> data = new HashMap<>();
		data.put("Name", "Jameel Kaisar");
		data.put("Account", "Savings");
		data.put("Number", "0246813579");
		return new Details(data);
	}

	@GetMapping("/api/balance")
	public Balance balance() {
        String data = "$7140";
		return new Balance(data);
	}

	@GetMapping("/api/transactions")
	public Transactions transactions() {
        String[] data = {"Paid $100 to Jameel", "Received $20 from Kaisar", "Paid $100 to Khan"};
		return new Transactions(data);
	}
}
